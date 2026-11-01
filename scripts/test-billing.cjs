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

(async () => {
  const { withCheckoutLock, CheckoutBusyError } = load('lib/billing/checkout-lock.ts');
  let held = false;
  let acquisitions = 0;
  const calls = [];
  const service = { async rpc(name, args) {
    calls.push({ name, args });
    if (name === 'acquire_billing_checkout_lock') {
      if (held) return { data: null, error: null };
      held = true;
      return { data: `token-${++acquisitions}`, error: null };
    }
    held = false;
    return { data: true, error: null };
  } };
  let finish;
  const pending = withCheckoutLock(service, 'workspace', () => new Promise(resolve => { finish = resolve; }));
  await Promise.resolve();
  let duplicateWorkRan = false;
  await assert.rejects(withCheckoutLock(service, 'workspace', async () => { duplicateWorkRan = true; }), CheckoutBusyError);
  assert.equal(duplicateWorkRan, false);
  finish('checkout-url');
  assert.equal(await pending, 'checkout-url');
  assert.equal(held, false);
  await assert.rejects(withCheckoutLock(service, 'workspace', async () => { throw new Error('Stripe failed'); }), /Stripe failed/);
  assert.equal(held, false);
  assert.equal(calls.filter(x => x.name === 'release_billing_checkout_lock').length, 2);
  assert.equal(calls.at(-1).args.p_token, 'token-2');
  let ran = false;
  await assert.rejects(withCheckoutLock({ rpc: async () => ({ data: null, error: new Error('offline') }) }, 'workspace', async () => { ran = true; }), /unavailable/);
  assert.equal(ran, false);
  let count = 0;
  await assert.rejects(withCheckoutLock({ rpc: async () => ++count === 1 ? { data: 'token', error: null } : { data: false, error: null } }, 'workspace', async () => 'url'), /release failed/);
  console.log('Checkout concurrency, failure cleanup, and fail-closed tests passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
