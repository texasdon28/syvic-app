export function getAppUrl() {
  const deploymentUrl = process.env.VERCEL_ENV === 'preview'
    ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
    : undefined;
  const configuredUrl = deploymentUrl
    ? `https://${deploymentUrl}`
    : process.env.NEXT_PUBLIC_APP_URL
      || (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000');

  return new URL(configuredUrl).origin;
}
