const assert = require('node:assert/strict');
const fs = require('node:fs');

const manifest = JSON.parse(fs.readFileSync('public/manifest.webmanifest', 'utf8'));
assert.equal(manifest.name, 'SYVIC');
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.start_url, '/dashboard');
assert.equal(manifest.scope, '/');
assert.equal(manifest.id, '/');
for (const size of [192, 512]) {
  assert.ok(manifest.icons.some(icon => icon.sizes === `${size}x${size}` && icon.type === 'image/png'));
}
const icon = fs.readFileSync('app/app-icon/route.tsx', 'utf8');
assert.ok(icon.includes('[180, 192, 512].includes(requested)'));
const layout = fs.readFileSync('app/layout.tsx', 'utf8');
assert.ok(layout.includes("manifest: '/manifest.webmanifest'"));
assert.ok(layout.includes("viewportFit: 'cover'"));
const header = fs.readFileSync('components/app-header.tsx', 'utf8');
assert.ok(header.includes('aria-label="Main navigation"'));
assert.ok(header.includes("aria-current={active ? 'page' : undefined}"));
assert.ok(header.includes('safe-area') || fs.readFileSync('app/globals.css', 'utf8').includes('safe-area-inset-bottom'));
const install = fs.readFileSync('components/install-app.tsx', 'utf8');
assert.ok(install.includes('beforeinstallprompt'));
assert.ok(install.includes('appinstalled'));
assert.ok(!install.includes('serviceWorker'), 'No service worker or sensitive offline cache introduced');
console.log('Manifest, icon sizes, mobile navigation, safe-area and installation wiring checks passed.');
