const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, env, resolve = () => ({})) {
  const exports = {};
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(compiled, { exports, process: { env }, require: resolve });
  return exports;
}

(async () => {
  const env = { VERCEL_ENV: 'production' };
  const launch = load('lib/launch-mode.ts', env);
  assert.equal(launch.isControlledBeta(), true);
  env.SYVIC_LAUNCH_MODE = 'paid';
  assert.equal(launch.isControlledBeta(), true, 'An environment value cannot enable production billing');
  env.VERCEL_ENV = 'preview';
  assert.equal(launch.isControlledBeta(), false);
  env.SYVIC_LAUNCH_MODE = 'beta';
  assert.equal(launch.isControlledBeta(), true);
  const billing = load('lib/billing/actions.ts', env, name => {
    if (name === '@/lib/launch-mode') return launch;
    if (name === 'next/navigation') return { redirect(location) { throw Object.assign(new Error('redirect'), { location }); } };
    return {};
  });
  await assert.rejects(billing.createCheckoutSession({ get() { throw new Error('Beta must stop before checkout data or credentials are read'); } }), error => error.location === '/pricing?error=beta');
  await assert.rejects(billing.createBillingPortalSession(), error => error.location === '/settings?billing=beta');
  assert.match(launch.BETA_ACCESS_DESCRIPTION, /No payments are collected/);
  assert.match(launch.BETA_ACCESS_DESCRIPTION, /New accounts do not include PDF or print export credits/);
  for (const file of ['app/page.tsx', 'app/pricing/page.tsx', 'app/settings/page.tsx']) {
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /isControlledBeta/);
    assert.match(source, /BETA_ACCESS_DESCRIPTION/);
  }
  console.log('Production beta default, checkout/portal denial and accurate access disclosure tests passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
