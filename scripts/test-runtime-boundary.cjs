const assert = require('node:assert/strict');
const { forbiddenImports } = require('./check-runtime-boundary.cjs');
assert.deepEqual(forbiddenImports("import { minimatch } from 'minimatch';"), ['minimatch']);
assert.deepEqual(forbiddenImports("const glob = require('glob');"), ['glob']);
assert.deepEqual(forbiddenImports("await import('sucrase');"), ['sucrase']);
assert.deepEqual(forbiddenImports("import 'postcss';"), ['postcss']);
assert.deepEqual(forbiddenImports("import type { Config } from 'tailwindcss';"), ['tailwindcss']);
assert.deepEqual(forbiddenImports("import { z } from 'zod'; import { cn } from '@/lib/utils';"), []);
console.log('Runtime boundary import detection tests passed.');
