const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, modules) {
  const exports = {};
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(compiled, { exports, Response, Buffer, URL, require: name => {
    if (!(name in modules)) throw new Error(`Unexpected import ${name}`);
    return modules[name];
  } });
  return exports;
}

(async () => {
  let user = null;
  let caseRecord = null;
  let writes = 0;
  let allowanceCalls = 0;
  let pdfCalls = 0;
  const db = {
    auth: { getUser: async () => ({ data: { user } }) },
    rpc: async () => { allowanceCalls++; return { data: { allowed: true }, error: null }; },
    from(table) {
      const chain = {
        select() { return chain; }, eq() { return chain; }, in() { return chain; },
        update() { writes++; return chain; },
        single: async () => ({ data: caseRecord, error: null }),
        then(resolve) { return Promise.resolve({ data: table === 'organization_members' ? [{ organization_id: 'own-workspace' }] : [], error: null }).then(resolve); },
      };
      return chain;
    },
  };
  const modules = {
    '@/lib/supabase/server': { createServerSupabaseClient: async () => db },
    '@/lib/cases/packet': { packetSchema: { safeParse: input => ({ success: true, data: input }) } },
    '@/lib/cases/packet-pdf': { buildPacketPdf: async () => { pdfCalls++; return new Uint8Array([1]); } },
    'next/cache': { revalidatePath() {} },
  };
  const actions = load('app/cases/[id]/packet/actions.ts', modules);
  assert.match((await actions.savePacket('foreign', {})).error, /log in/);
  user = { id: 'own-user' };
  assert.match((await actions.savePacket('foreign', {})).error, /unavailable/);
  assert.match((await actions.authorizePacketPrint('foreign', 'title', {})).error, /unavailable/);
  assert.equal(writes, 0);
  assert.equal(allowanceCalls, 0);
  const pdf = load('app/cases/[id]/packet/pdf/route.ts', modules);
  const request = origin => new Request('https://syvic.example/cases/foreign/packet/pdf', { method: 'POST', headers: { origin } });
  const context = { params: Promise.resolve({ id: 'foreign' }) };
  assert.equal((await pdf.POST(request('https://attacker.example'), context)).status, 403);
  user = null;
  assert.equal((await pdf.POST(request('https://syvic.example'), context)).status, 401);
  user = { id: 'own-user' };
  assert.equal((await pdf.POST(request('https://syvic.example'), context)).status, 404);
  caseRecord = { organization_id: 'foreign-workspace', title: 'PRIVATE', metadata: { packet: {} } };
  assert.equal((await pdf.POST(request('https://syvic.example'), context)).status, 404);
  assert.equal(pdfCalls, 0);
  assert.equal(allowanceCalls, 0);
  console.log('Unauthenticated/foreign packet save, print, PDF, origin and allowance denial checks passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
