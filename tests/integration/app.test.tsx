import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRegistry } from '../../src/composition-root';
import { App } from '../../src/presentation/App';
import { renderWithProviders } from '../renderWithProviders';
import { testDependencies } from '../renderWithProviders';

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
    expect(
      screen.getByRole('region', { name: /Duas frentes/ }),
    ).toHaveTextContent('Desenvolvedor Trainee');
    expect(
      screen.getByRole('region', { name: 'Tecnologias e práticas.' }),
    ).toHaveTextContent('Versionamento, build e CI/CD');
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
    expect(screen.getByRole('region', { name: /Two paths/ })).toHaveTextContent(
      'Trainee Software Developer',
    );
    expect(
      screen.getByRole('region', { name: 'Technologies and practices.' }),
    ).toHaveTextContent('Version Control, Build & CI/CD');
    expect(
      screen.queryByText(/1 ano e 6 meses|1 year and 6 months/i),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Copy email' }));
    expect(writeText).toHaveBeenCalledExactlyOnceWith(
      'contato.ricardolhc@gmail.com',
    );
    expect(
      screen.getByRole('status', { name: 'Copy status' }),
    ).toHaveTextContent('Email copied');
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
      expect(
        screen.getByRole('status', { name: 'Status da cópia' }),
      ).toHaveTextContent('Selecione e copie o endereço abaixo.');
      expect(
        screen.getByRole('textbox', { name: 'E-mail para copiar manualmente' }),
      ).toHaveValue('contato.ricardolhc@gmail.com');
      expect(
        screen.getByRole('button', { name: 'Enviar mensagem' }),
      ).toBeEnabled();
    },
  );
});

async function fillContact(user: ReturnType<typeof userEvent.setup>) {
  for (const [name, text] of [
    ['Nome', ' Ana '],
    ['Seu melhor e-mail', ' ana@example.com '],
    ['Assunto', ' Projeto & integração '],
    ['Mensagem', ' Uma solução para a empresa. '],
  ])
    await user.type(screen.getByRole('textbox', { name }), text!);
}
describe('contact through registry, real gateway and browser boundary', () => {
  it('uses the production composition root and only clears after a valid HTTP acknowledgement', async () => {
    localStorage.setItem('portfolio.language', 'pt-BR');
    vi.mocked(fetch).mockResolvedValue(
      new Response('{"next":"https://formspree.io/thanks"}', { status: 200 }),
    );
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<App />, createRegistry());
    await fillContact(user);
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      'https://formspree.io/f/moeeapay',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Ana',
          email: 'ana@example.com',
          subject: 'Projeto & integração',
          message: 'Uma solução para a empresa.',
          _gotcha: '',
        }),
      }),
    );
    expect(
      screen.getByRole('status', { name: 'Status da mensagem' }),
    ).toHaveTextContent(/Mensagem enviada com sucesso/);
    expect(screen.getByRole('textbox', { name: 'Mensagem' })).toHaveValue('');
  });
  it('substitutes the contact gateway in a specific registry without calling HTTP', async () => {
    const deps = testDependencies();
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<App />, deps.registry);
    await fillContact(user);
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(deps.send).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'ana@example.com',
      subject: 'Projeto & integração',
      message: 'Uma solução para a empresa.',
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(
      screen.getByRole('status', { name: 'Status da mensagem' }),
    ).toHaveTextContent(/Mensagem enviada com sucesso/);
  });
  it.each(['network', 'invalid', 'rateLimited', 'rejected'])(
    'preserves the draft after %s and recovers on retry through the real adapter',
    async (condition) => {
      localStorage.setItem('portfolio.language', 'pt-BR');
      if (condition === 'network')
        vi.mocked(fetch).mockRejectedValueOnce(new TypeError('offline'));
      else
        vi.mocked(fetch).mockResolvedValueOnce(
          new Response(
            condition === 'invalid'
              ? '<html>not JSON</html>'
              : '{"errors":[{"message":"private"}]}',
            {
              status:
                condition === 'rateLimited'
                  ? 429
                  : condition === 'rejected'
                    ? 422
                    : 200,
            },
          ),
        );
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response('{"next":"https://formspree.io/thanks"}', { status: 200 }),
      );
      const user = userEvent.setup({ delay: null });
      renderWithProviders(<App />, createRegistry());
      await fillContact(user);
      await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
      expect(
        screen.getByRole('status', { name: 'Status da mensagem' }),
      ).toHaveTextContent(
        condition === 'rateLimited'
          ? /Muitas tentativas/
          : /Não foi possível enviar/,
      );
      expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue(
        ' Ana ',
      );
      expect(screen.queryByText('private')).not.toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
      expect(
        screen.getByRole('status', { name: 'Status da mensagem' }),
      ).toHaveTextContent(/Mensagem enviada com sucesso/);
      expect(fetch).toHaveBeenCalledTimes(2);
    },
  );
});
