import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/domain/contracts.ts',
        'src/presentation/i18n/messages.ts',
      ],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: { lines: 85, branches: 80, functions: 85, statements: 85 },
    },
  },
});
