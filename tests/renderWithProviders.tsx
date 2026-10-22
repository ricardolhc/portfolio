import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { vi } from 'vitest';
import { Registry } from '../src/core/di/registry';
import { DependencyProvider } from '../src/core/di/dependency-provider';
import { PreferencesProvider } from '../src/presentation/preferences/PreferencesProvider';
import { PreferenceService } from '../src/application/preference-service';
import { TOKENS } from '../src/application/tokens';

export function testDependencies(language = 'pt-BR', theme = 'light') {
  const values = new Map([
    ['portfolio.language', language],
    ['portfolio.theme', theme],
  ]);
  const write = vi.fn().mockResolvedValue(undefined);
  const send = vi
    .fn<
      (
        message: import('../src/domain/contracts').ContactMessage,
      ) => Promise<void>
    >()
    .mockResolvedValue(undefined);
  const registry = new Registry()
    .register(TOKENS.clipboard, () => ({ write }))
    .register(TOKENS.contactGateway, () => ({ send }))
    .register(
      TOKENS.preferences,
      () =>
        new PreferenceService(
          {
            get: (key) => values.get(key) ?? null,
            set: (key, value) => {
              values.set(key, value);
            },
          },
          { language: 'pt-BR', prefersDark: () => false },
        ),
    );
  return { registry, write, send, values };
}

export function renderWithProviders(
  ui: ReactNode,
  registry = testDependencies().registry,
) {
  return render(
    <DependencyProvider registry={registry}>
      <PreferencesProvider>{ui}</PreferencesProvider>
    </DependencyProvider>,
  );
}
