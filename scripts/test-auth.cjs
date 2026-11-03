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
  let resetInput;
  let updateInput;
  let currentUser = { id: 'fixture' };
  let updateError = null;
  const client = {
    auth: {
      async signUp(input) { signupInput = input; return signupResult; },
      async signInWithPassword() { return { error: signinError }; },
      async signOut() { signouts++; },
      async exchangeCodeForSession() { return { error: exchangeError }; },
      async resetPasswordForEmail(email, options) { resetInput = { email, options }; return { error: new Error('Private provider failure') }; },
      async getUser() { return { data: { user: currentUser }, error: null }; },
      async updateUser(input) { updateInput = input; return { error: updateError }; },
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
  const recovery = { nextUrl: new URL(`${origin}/auth/callback?code=fixture&next=/reset-password`) };
  assert.match(await callback.GET(recovery), /\/forgot-password\?error=/);
  exchangeError = null;
  assert.equal(await callback.GET(recovery), `${origin}/reset-password`);
  assert.equal(setupCalls, count);
  await assert.rejects(auth.requestPasswordReset(fields), redirectsTo('/forgot-password?sent=1'));
  assert.equal(resetInput.email, 'fixture@example.invalid');
  assert.equal(resetInput.options.redirectTo, `${origin}/auth/callback?next=/reset-password`);
  const passwordFields = (password, confirmation) => ({ get: key => ({ password, confirmation })[key] });
  await assert.rejects(auth.updatePassword(passwordFields('short', 'short')), error => error.location.startsWith('/reset-password?error='));
  await assert.rejects(auth.updatePassword(passwordFields('long-password', 'different')), error => error.location.startsWith('/reset-password?error='));
  assert.equal(updateInput, undefined);
  currentUser = null;
  await assert.rejects(auth.updatePassword(passwordFields('long-password', 'long-password')), error => error.location.startsWith('/forgot-password?error='));
  assert.equal(updateInput, undefined);
  currentUser = { id: 'fixture' };
  updateError = new Error('Private provider failure');
  await assert.rejects(auth.updatePassword(passwordFields('long-password', 'long-password')), error => !error.location.includes('Private') && error.location.startsWith('/reset-password?error='));
  updateError = null;
  await assert.rejects(auth.updatePassword(passwordFields('long-password', 'long-password')), redirectsTo('/login?message=password-updated'));
  assert.equal(updateInput.password, 'long-password');
  assert.equal(signouts, 3);
  console.log('Signup confirmation, workspace setup, login failure, and callback redirect tests passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
