import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRegistry } from '../../src/composition-root';
import { App } from '../../src/presentation/App';
import { renderWithProviders } from '../renderWithProviders';

const clipboardDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  'clipboard',
);
beforeEach(() => localStorage.clear());
afterEach(() => {
  localStorage.clear();
  if (clipboardDescriptor)
    Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
  else Reflect.deleteProperty(navigator, 'clipboard');
});
function browserClipboard(value: unknown) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value });
}

describe('real composition root, providers and browser adapters', () => {
  it('persists user preferences across new registries and copies through the real clipboard adapter', async () => {
    const user = userEvent.setup({ delay: null });
    const writeText = vi.fn().mockResolvedValue(undefined);
    browserClipboard({ writeText });
    localStorage.setItem('portfolio.language', 'pt-BR');
    renderWithProviders(<App />, createRegistry());
    await user.click(
      screen.getByRole('button', { name: 'Ativar tema escuro' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'PT / EN: mudar para inglês' }),
    );
    expect(localStorage.getItem('portfolio.theme')).toBe('dark');
    expect(localStorage.getItem('portfolio.language')).toBe('en');
    cleanup();
    renderWithProviders(<App />, createRegistry());
    expect(document.documentElement).toHaveAttribute('lang', 'en');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('link', { name: 'Send email' })).toHaveAttribute(
      'href',
      'mailto:contato.ricardolhc@gmail.com?subject=Portfolio%20contact',
    );
    await user.click(screen.getByRole('button', { name: 'Copy email' }));
    expect(writeText).toHaveBeenCalledExactlyOnceWith(
      'contato.ricardolhc@gmail.com',
    );
    expect(screen.getByRole('status')).toHaveTextContent('Email copied');
  });
  it.each(['unavailable', 'denied'])(
    'keeps contact usable when the browser clipboard is %s',
    async (condition) => {
      localStorage.setItem('portfolio.language', 'pt-BR');
      const user = userEvent.setup({ delay: null });
      browserClipboard(
        condition === 'unavailable'
          ? undefined
          : { writeText: () => Promise.reject(new Error('denied')) },
      );
      renderWithProviders(<App />, createRegistry());
      await user.click(screen.getByRole('button', { name: 'Copiar e-mail' }));
      expect(screen.getByRole('status')).toHaveTextContent(
        'Selecione e copie o endereço abaixo.',
      );
      expect(
        screen.getByRole('textbox', { name: 'E-mail para copiar manualmente' }),
      ).toHaveValue('contato.ricardolhc@gmail.com');
      expect(
        screen.getByRole('link', { name: 'Enviar e-mail' }),
      ).toHaveAttribute(
        'href',
        'mailto:contato.ricardolhc@gmail.com?subject=Contato%20pelo%20portf%C3%B3lio',
      );
    },
  );
});
