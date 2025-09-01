import { defineConfig } from "vite";
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'foundryVitePlugin',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [],
      output: {
        entryFileNames: 'index.js',
      },
    },
    minify: false,
    sourcemap: true,
  },
});
