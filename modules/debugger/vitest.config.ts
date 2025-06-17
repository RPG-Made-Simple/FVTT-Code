import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/constants.ts',
        'src/imports.ts',
      ],
      include: [
        'src/**/*.{ts,js}'
      ]
    },
    include: ['tests/**/*.{test,spec}.{ts,js}'],
    setupFiles: ['./tests/setup.ts'],
    exclude: ['dist/**/*', 'node_modules/**/*'],
  }
})
