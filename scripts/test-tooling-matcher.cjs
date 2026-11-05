const assert = require('node:assert/strict');
const path = require('node:path');
const { createRequire } = require('node:module');

const nextLintRequire = createRequire(require.resolve('eslint-config-next'));
const parserRequire = createRequire(nextLintRequire.resolve('@typescript-eslint/typescript-estree'));
const matcher = parserRequire('minimatch');
assert.equal(parserRequire('minimatch/package.json').version, '11.0.1');
assert.equal(matcher.minimatch('app/login/page.tsx', '**/*.tsx', { dot: true }), true);
assert.equal(matcher.minimatch('.hidden/file.ts', '**/*.ts', { dot: true }), true);
assert.equal(matcher.minimatch('app/page.tsx', '**/*.{ts,tsx}', { dot: true }), true);
assert.equal(matcher.minimatch('app/page.js', '**/*.tsx', { dot: true }), false);
const parser = nextLintRequire('@typescript-eslint/parser');
const parsed = parser.parseForESLint('const value: string = "fixture";', { filePath: path.resolve('app/fixture.ts'), ecmaVersion: 2022, sourceType: 'module' });
assert.equal(parsed.ast.type, 'Program');
console.log('Scoped patched matcher API, file patterns and TypeScript parser checks passed.');
