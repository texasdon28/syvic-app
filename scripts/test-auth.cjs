const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, modules) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, { exports, URL, require: name => {
    if (!(name in modules)) throw new Error(`Unexpected import: ${name}`);
    return modules[name];
  } });
  return exports;
}

(async () => {
  const origin = 'https://syvic-preview.example';
  let signupResult = { data: { user: { id: 'fixture' }, session: null }, error: null };
  let signinError = null;
  let setupError = null;
  let exchangeError = null;
  let setupCalls = 0;
  let signouts = 0;
  let signupInput;
  const client = {
    auth: {
      async signUp(input) { signupInput = input; return signupResult; },
      async signInWithPassword() { return { error: signinError }; },
      async signOut() { signouts++; },
      async exchangeCodeForSession() { return { error: exchangeError }; },
    },
    async rpc(name) {
      assert.equal(name, 'ensure_my_workspace');
      setupCalls++;
      return { data: setupError ? null : 'workspace', error: setupError };
    },
  };
  const modules = {
    '@/lib/auth/app-url': { getAppUrl: () => origin },
    '@/lib/supabase/server': { createServerSupabaseClient: async () => client },
    'next/navigation': { redirect(location) { throw Object.assign(new Error('redirect'), { location }); } },
    'next/server': { NextResponse: { redirect: url => url.href } },
  };
  const auth = load('lib/auth/actions.ts', modules);
  const fields = { get: key => ({ name: 'Synthetic User', email: 'fixture@example.invalid', password: 'synthetic-unused-password' })[key] };
  const redirectsTo = location => error => error.location === location;
  await assert.rejects(auth.signup(fields), redirectsTo('/login?message=confirm-email'));
  assert.equal(signupInput.options.emailRedirectTo, `${origin}/auth/callback`);
  assert.equal(setupCalls, 0);
  signupResult = { data: { user: { id: 'fixture' }, session: { access_token: 'fixture' } }, error: null };
  await assert.rejects(auth.signup(fields), redirectsTo('/dashboard'));
  assert.equal(setupCalls, 1);
  signupResult = { data: {}, error: { message: 'Private provider detail' } };
  await assert.rejects(auth.signup(fields), redirectsTo('/signup?error=signup-failed'));
  assert.equal(setupCalls, 1);
  await assert.rejects(auth.login(fields), redirectsTo('/dashboard'));
  signinError = { code: 'email_not_confirmed' };
  await assert.rejects(auth.login(fields), error => decodeURIComponent(error.location).includes('Confirm your email'));
  assert.equal(setupCalls, 2);
  signinError = null;
  setupError = new Error('Temporary database outage');
  await assert.rejects(auth.login(fields), error => decodeURIComponent(error.location).includes('Account setup could not finish'));
  assert.equal(signouts, 1);
  const callback = load('app/auth/callback/route.ts', modules);
  const request = { nextUrl: new URL(`${origin}/auth/callback?code=fixture&next=https://untrusted.example`) };
  setupError = null;
  assert.equal(await callback.GET(request), `${origin}/dashboard`);
  setupError = new Error('Temporary database outage');
  assert.match(await callback.GET(request), /\/login\?error=Account/);
  assert.equal(signouts, 2);
  exchangeError = new Error('Expired confirmation');
  const count = setupCalls;
  assert.match(await callback.GET(request), /\/login\?error=This/);
  assert.equal(setupCalls, count);
  assert.match(await callback.GET({ nextUrl: new URL(`${origin}/auth/callback`) }), /\/login\?error=This/);
  console.log('Signup confirmation, workspace setup, login failure, and callback redirect tests passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
