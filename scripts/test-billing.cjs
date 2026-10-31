const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, env = {}, requireModule = require) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(source, { exports, require: requireModule, process: { env } });
  return exports;
}

const env = {};
const plans = load('lib/billing/plans.ts', env);
assert.equal(plans.isPaidPlan('essential'), true);
assert.equal(plans.isPaidPlan('__proto__'), false);
assert.equal(plans.isPaidPlan('team'), false);
assert.equal(plans.planForPrice('price_unknown'), null);
for (const name of ['essential', 'pro', 'portfolio']) {
  assert.equal(plans.plans[name].annual, plans.plans[name].monthly * 10);
  for (const interval of ['monthly', 'annual']) {
    const id = `price_${name}_${interval}`;
    env[plans.priceEnvironmentKey(name, interval)] = id;
    const matched = plans.planForPrice(id);
    assert.equal(matched.plan, name);
    assert.equal(matched.interval, interval);
  }
}
class StripeMock { constructor(key) { this.key = key; } }
const stripeEnv = {};
const stripe = load('lib/billing/stripe.ts', stripeEnv, () => StripeMock);
assert.throws(() => stripe.getStripe(), /not configured/);
stripeEnv.STRIPE_SECRET_KEY = 'sk_live_fixture';
assert.throws(() => stripe.getStripe(), /not enabled/);
stripeEnv.STRIPE_SECRET_KEY = 'sk_test_fixture';
assert.equal(stripe.getStripe().key, 'sk_test_fixture');
console.log('Billing catalog, annual pricing, price mapping, and live-payment guard tests passed.');
