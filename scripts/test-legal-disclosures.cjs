const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { PDFDocument } = require('pdf-lib');
function load(file, modules = {}) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('exports', 'require', source)(exports, name => modules[name] || require(name));
  return exports;
}
(async () => {
  const disclosure = load('lib/legal/disclosures.ts');
  assert.match(disclosure.LEGAL_DISCLOSURE, /not a law firm/);
  assert.match(disclosure.LEGAL_DISCLOSURE, /not a substitute for the advice of an attorney/);
  assert.match(fs.readFileSync('app/layout.tsx', 'utf8'), /Important legal disclosure/);
  assert.match(fs.readFileSync('app/cases/[id]/packet/packet-editor.tsx', 'utf8'), /\{LEGAL_DISCLOSURE\}/);
  assert.doesNotMatch(fs.readFileSync('app/deadlines/page.tsx', 'utf8'), /getDeadlinesByWorkflow|deadline\.timeframe/);
  const { buildPacketPdf } = load('lib/cases/packet-pdf.ts', { '@/lib/legal/disclosures': disclosure });
  const bytes = await buildPacketPdf('SYNTHETIC disclosure verification', {
    ledger: Array.from({ length: 45 }, (_, i) => ({ date: '2026-11-01', description: `SYNTHETIC ledger record ${i + 1}`, charge: 10, payment: 0 })),
    chronology: [{ date: '2026-11-01', description: 'SYNTHETIC event' }],
    evidence: [{ label: 'SAMPLE A', description: 'Index only, no attachment' }],
  });
  const pdf = await PDFDocument.load(bytes);
  assert.ok(pdf.getPageCount() >= 4, 'Exercise continuation-page footers');
  if (process.argv[2]) { fs.mkdirSync(path.dirname(process.argv[2]), { recursive: true }); fs.writeFileSync(process.argv[2], bytes); }
  console.log(`Disclosure placement and PDF generation checks passed (${pdf.getPageCount()} pages).`);
})().catch(error => { console.error(error); process.exitCode = 1; });
