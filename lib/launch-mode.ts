export function isControlledBeta() {
  return process.env.VERCEL_ENV === 'production' || process.env.SYVIC_LAUNCH_MODE === 'beta';
}

export const BETA_ACCESS_DESCRIPTION = 'Controlled beta. No payments are collected. Accounts can save and review records. New accounts do not include PDF or print export credits. Existing tester document access remains subject to its allowance.';
