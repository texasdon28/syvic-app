const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, { exports, require });
  return exports;
}
const { landlordIntakeSchema: schema, intakeDefaults } = load('lib/cases/landlord-intake.ts');
const catalog = load('lib/documents/catalog.ts');
const valid = { ...intakeDefaults, address_line1: 'SYNTHETIC 100 Test Street', city: 'Houston', zip_code: '77002',
  title: 'Synthetic test', landlord_name: 'Sample Landlord', tenant_first_name: 'Sample', tenant_last_name: 'Tenant', acknowledgment: 'yes' };
assert.equal(schema.safeParse(valid).success, true);
for (const bad of [
  { county: 'other' }, { property_use: 'commercial' }, { acknowledgment: '' }, { property_type: 'commercial' },
  { zip_code: '7' }, { monthly_rent: '-1' }, { monthly_rent: 'NaN' }, { monthly_rent: '100.001' },
  { notice_date: '2026-02-30', notice_status: 'sent' }, { notice_status: 'not_sent', notice_method: 'Mail' },
  { subsidized: 'assumed-no' }, { title: '' }, { source_document: 'eviction-petition' },
]) assert.equal(schema.safeParse({ ...valid, ...bad }).success, false, JSON.stringify(bad));
assert.equal(schema.safeParse({ ...valid, notice_status: 'sent', notice_date: '2026-11-01', notice_method: 'User-entered record' }).success, true);
assert.equal(schema.parse({ ...valid, organization_id: 'untrusted' }).organization_id, undefined);
assert.equal(catalog.documentCatalog.length, 6);
assert.equal(catalog.documentCatalog.filter(item => item.status === 'available').length, 3);
for (const item of catalog.documentCatalog) {
  assert.equal(Boolean(catalog.availableDocument(item.id)), item.status === 'available');
}
assert.equal(catalog.availableDocument('__proto__'), undefined);
console.log('Landlord scope, date, amount, review-gate and document-catalog tests passed.');
