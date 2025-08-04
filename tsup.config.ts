import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/identity.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  minify: false, // Keep readable for debugging
});
