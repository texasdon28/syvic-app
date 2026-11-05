const assert = require('node:assert/strict');
const fs = require('node:fs');
const paths = ['app/page.tsx', 'app/product/page.tsx', 'app/about/page.tsx', 'app/pricing/page.tsx', 'app/contact/page.tsx', 'app/privacy/page.tsx', 'app/blog/page.tsx'];
const sources = Object.fromEntries(paths.map(path => [path, fs.readFileSync(path, 'utf8')]));
for (const [path, text] of Object.entries(sources)) {
  for (const unsupported of [/unlimited exports/i, /SOC\s*2/i, /within 24 hours/i, /10GB|50GB/, /court-ready/i, /track deadlines/i, /hearing date calculations/i, /compliant case packets/i]) {
    assert.doesNotMatch(text, unsupported, `${path}: unsupported claim`);
  }
}
assert.match(sources['app/page.tsx'], /import \{ plans, PaidPlan \}/);
assert.match(sources['app/page.tsx'], /plans\[key\]\.documents/);
assert.match(sources['app/pricing/page.tsx'], /import \{ plans, PaidPlan \}/);
assert.doesNotMatch(sources['app/blog/page.tsx'], /\/blog\/\$\{/);
assert.match(sources['app/contact/page.tsx'], /const form = e.currentTarget/);
assert.match(sources['app/contact/page.tsx'], /role=\{failed \? 'alert' : 'status'\}/);
const labels = fs.readFileSync('lib/legal/disclosures.ts', 'utf8');
assert.match(labels, /Internal legal review pending/);
for (const path of ['app/templates/page.tsx', 'app/product/page.tsx', 'app/page.tsx']) assert.match(fs.readFileSync(path, 'utf8'), /INTERNAL_LEGAL_REVIEW_LABEL/);
console.log('Marketing claims, shared pricing, internal-review label and contact feedback checks passed.');
