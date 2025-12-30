import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/**', 'dist/**', '**/*.test.mjs', '**/__tests__/**', 'vitest.config.js']
    }
  }
})
