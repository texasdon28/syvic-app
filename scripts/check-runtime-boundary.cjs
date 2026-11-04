const fs = require('node:fs');
const path = require('node:path');

const buildOnly = ['eslint', 'eslint-config-next', 'minimatch', 'glob', 'sucrase', 'tailwindcss', 'autoprefixer', 'postcss'];

function forbiddenImports(source) {
  const imports = [...source.matchAll(/(?:from\s*|require\(\s*|import\(\s*|import\s*)['"]([^'"]+)['"]/g)].map(match => match[1]);
  return imports.filter(name => buildOnly.some(pkg => name === pkg || name.startsWith(pkg + '/')));
}

function walk(directory, visit) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'cache' || entry.name === 'static') continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file, visit);
    else visit(file);
  }
}

function check() {
  const problems = [];
  for (const directory of ['app', 'components', 'lib']) {
    walk(directory, file => {
      if (!/\.[cm]?[jt]sx?$/.test(file)) return;
      for (const name of forbiddenImports(fs.readFileSync(file, 'utf8'))) problems.push(`${file}: runtime import ${name}`);
    });
  }
  let traces = 0;
  walk('.next', file => {
    if (!file.endsWith('.nft.json')) return;
    traces++;
    const trace = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const dependency of trace.files || []) {
      const normalized = dependency.replace(/\\/g, '/');
      if (buildOnly.some(pkg => normalized.includes(`/node_modules/${pkg}/`) || normalized.endsWith(`/node_modules/${pkg}`))) {
        problems.push(`${file}: traced build dependency ${dependency}`);
      }
    }
  });
  if (!traces) problems.push('No production dependency traces found; run the production build first.');
  if (problems.length) throw new Error(problems.join('\n'));
  console.log(`Runtime boundary passed: no build-only imports or dependencies in ${traces} production traces.`);
}

module.exports = { forbiddenImports };
if (require.main === module) {
  try { check(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
