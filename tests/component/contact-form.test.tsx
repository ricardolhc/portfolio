import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/application/tokens';
import { LanguageSwitcher } from '../../src/presentation/components/Controls';
import { ContactForm } from '../../src/presentation/components/ContactForm';
import { renderWithProviders, testDependencies } from '../renderWithProviders';

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nome'), 'Ana Silva');
  await user.type(screen.getByLabelText('E-mail'), 'ana@example.com');
  await user.type(screen.getByLabelText('Assunto'), 'Integração & software');
  await user.type(
    screen.getByLabelText('Mensagem'),
    'Olá Ricardo, vamos automatizar um processo?',
  );
}
describe('ContactForm', () => {
  it('validates accessibly and focuses the first invalid field without opening mail', async () => {
    const deps = testDependencies();
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<ContactForm />, deps.registry);
    await user.click(
      screen.getByRole('button', { name: 'Abrir aplicativo de e-mail' }),
    );
    expect(screen.getAllByText('Preencha este campo.')).toHaveLength(4);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Revise os campos indicados',
    );
    expect(screen.getByLabelText('Nome')).toHaveFocus();
    expect(screen.getByLabelText('Nome')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription(
      'Preencha este campo.',
    );
    expect(screen.getByLabelText('Mensagem')).toHaveAccessibleDescription(
      'Preencha este campo.',
    );
    expect(deps.open).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText('Nome'), 'A');
    await user.type(screen.getByLabelText('E-mail'), 'invalid');
    await user.type(screen.getByLabelText('Assunto'), 'Oi');
    await user.type(screen.getByLabelText('Mensagem'), 'Curta');
    await user.click(
      screen.getByRole('button', { name: 'Abrir aplicativo de e-mail' }),
    );
    expect(screen.getAllByText(/O texto está muito curto/)).toHaveLength(3);
    expect(
      screen.getByText('Informe um endereço de e-mail válido.'),
    ).toBeInTheDocument();
  });
  it('prepares and opens encoded email, and copies address and full message', async () => {
    const deps = testDependencies();
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<ContactForm />, deps.registry);
    await fillForm(user);
    await user.click(
      screen.getByRole('button', { name: 'Abrir aplicativo de e-mail' }),
    );
    expect(deps.open).toHaveBeenCalledTimes(1);
    const href = deps.open.mock.calls[0]![0] as string;
    expect(href).toContain(
      'mailto:contato.ricardolhc@gmail.com?subject=Integra%C3%A7%C3%A3o%20%26%20software&body=',
    );
    expect(decodeURIComponent(href)).toContain(
      'Nome: Ana Silva\nE-mail: ana@example.com\n\nMensagem:\nOlá Ricardo, vamos automatizar um processo?',
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Conclua o envio no seu aplicativo',
    );
    await user.click(screen.getByRole('button', { name: 'Copiar endereço' }));
    expect(deps.write).toHaveBeenLastCalledWith('contato.ricardolhc@gmail.com');
    expect(screen.getByLabelText('Mensagem para copiar')).toHaveValue(
      'Integração & software\n\nNome: Ana Silva\nE-mail: ana@example.com\n\nMensagem:\nOlá Ricardo, vamos automatizar um processo?',
    );
    await user.click(screen.getByRole('button', { name: 'Copiar mensagem' }));
    expect(deps.write).toHaveBeenLastCalledWith(
      'Integração & software\n\nNome: Ana Silva\nE-mail: ana@example.com\n\nMensagem:\nOlá Ricardo, vamos automatizar um processo?',
    );
    expect(screen.getByRole('status')).toHaveTextContent('Texto copiado.');
    expect(screen.getByLabelText('Mensagem para copiar')).toHaveValue(
      'Integração & software\n\nNome: Ana Silva\nE-mail: ana@example.com\n\nMensagem:\nOlá Ricardo, vamos automatizar um processo?',
    );
  });
  it('offers selectable text when email opening or clipboard fails', async () => {
    const deps = testDependencies();
    deps.open.mockImplementation(() => {
      throw new Error('no app');
    });
    deps.write.mockRejectedValue(new Error('denied'));
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<ContactForm />, deps.registry);
    await fillForm(user);
    await user.click(
      screen.getByRole('button', { name: 'Abrir aplicativo de e-mail' }),
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Não foi possível abrir',
    );
    await user.click(screen.getByRole('button', { name: 'Copiar mensagem' }));
    expect(screen.getByRole('status')).toHaveTextContent('Selecione e copie');
    expect(
      (screen.getByLabelText('Mensagem para copiar') as HTMLTextAreaElement)
        .value,
    ).toContain('Ana Silva');
    expect(screen.getByLabelText('E-mail de contato')).toHaveValue(
      'contato.ricardolhc@gmail.com',
    );
  });
  it('validates copying without opening mail and clears stale feedback on editing', async () => {
    const deps = testDependencies();
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<ContactForm />, deps.registry);
    await user.click(screen.getByRole('button', { name: 'Copiar mensagem' }));
    expect(screen.getByRole('status')).toHaveTextContent('Revise os campos');
    expect(deps.write).not.toHaveBeenCalled();
    await fillForm(user);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    await user.click(screen.getByRole('button', { name: 'Copiar mensagem' }));
    expect(deps.open).not.toHaveBeenCalled();
    expect(deps.write).toHaveBeenCalledTimes(1);
    await user.clear(screen.getByLabelText('Assunto'));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.getByLabelText('Mensagem para copiar')).toHaveValue('');
  });
  it('localizes validation and feedback when language changes', async () => {
    const deps = testDependencies('en');
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<ContactForm />, deps.registry);
    await user.click(
      screen.getByRole('button', { name: 'Open email application' }),
    );
    expect(screen.getAllByText('Fill in this field.')).toHaveLength(4);
    expect(screen.getByLabelText('Name')).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Copy address' }));
    expect(screen.getByRole('status')).toHaveTextContent('Text copied.');
  });
  it('provides single-line headers, a multiline message, email keyboard and autofill semantics', () => {
    renderWithProviders(<ContactForm />);
    const name = screen.getByLabelText('Nome');
    const email = screen.getByLabelText('E-mail');
    const subject = screen.getByLabelText('Assunto');
    const message = screen.getByLabelText('Mensagem');
    expect(name.tagName).toBe('INPUT');
    expect(name).toHaveAttribute('type', 'text');
    expect(name).toHaveAttribute('autocomplete', 'name');
    expect(email.tagName).toBe('INPUT');
    expect(email).toHaveAttribute('type', 'email');
    expect(email).toHaveAttribute('autocomplete', 'email');
    expect(subject.tagName).toBe('INPUT');
    expect(subject).toHaveAttribute('type', 'text');
    expect(subject).toHaveAttribute('autocomplete', 'off');
    expect(message.tagName).toBe('TEXTAREA');
    for (const [element, limit] of [
      [name, 100],
      [email, 254],
      [subject, 160],
      [message, 5000],
    ] as const) {
      expect(element).toHaveAttribute('maxlength', String(limit));
      expect(element).toBeRequired();
      expect(element).toHaveAttribute('aria-invalid', 'false');
      expect(element).toHaveAccessibleDescription(
        /Todos os campos são obrigatórios/,
      );
    }
  });
  it('prevents browser form navigation and focuses the first remaining invalid field', async () => {
    const deps = testDependencies();
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<ContactForm />, deps.registry);
    const form = screen.getByRole('form');
    expect(fireEvent.submit(form)).toBe(false);
    await user.type(screen.getByLabelText('Nome'), 'Ana');
    expect(fireEvent.submit(form)).toBe(false);
    expect(screen.getByLabelText('E-mail')).toHaveFocus();
    expect(deps.open).not.toHaveBeenCalled();
  });
  it('clears prepared text and feedback when editing the multiline message', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Copiar mensagem' }));
    expect(screen.getByRole('status')).toHaveTextContent('Texto copiado');
    await user.type(screen.getByLabelText('Mensagem'), '{Enter}Nova linha.');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.getByLabelText('Mensagem para copiar')).toHaveValue('');
    await user.click(screen.getByRole('button', { name: 'Copiar mensagem' }));
    expect(
      (screen.getByLabelText('Mensagem para copiar') as HTMLTextAreaElement)
        .value,
    ).toContain('\nNova linha.');
  });
  it.each(['Abrir aplicativo de e-mail', 'Copiar mensagem'])(
    'recovers from message preparation failures via %s',
    async (button) => {
      const deps = testDependencies();
      const service = deps.registry.resolve(TOKENS.contact);
      const prepare = vi.spyOn(service, 'prepare');
      const user = userEvent.setup({ delay: null });
      renderWithProviders(<ContactForm />, deps.registry);
      await fillForm(user);
      prepare.mockImplementationOnce(() => {
        throw new Error('composition failed');
      });
      await user.click(screen.getByRole('button', { name: button }));
      expect(screen.getByRole('status')).toHaveTextContent(
        'Não foi possível preparar a mensagem.',
      );
      expect(screen.getByLabelText('Mensagem para copiar')).toHaveValue('');
      expect(deps.open).not.toHaveBeenCalled();
      expect(deps.write).not.toHaveBeenCalled();
      await user.click(screen.getByRole('button', { name: 'Copiar endereço' }));
      expect(deps.write).toHaveBeenCalledWith('contato.ricardolhc@gmail.com');
      prepare.mockRestore();
      await user.click(screen.getByRole('button', { name: button }));
      expect(screen.getByLabelText('Mensagem para copiar')).toHaveValue(
        'Integração & software\n\nNome: Ana Silva\nE-mail: ana@example.com\n\nMensagem:\nOlá Ricardo, vamos automatizar um processo?',
      );
    },
  );
  it('keeps the form usable if a prepared preview fails after changing language', async () => {
    const deps = testDependencies();
    const user = userEvent.setup({ delay: null });
    renderWithProviders(
      <>
        <LanguageSwitcher />
        <ContactForm />
      </>,
      deps.registry,
    );
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Copiar mensagem' }));
    vi.spyOn(
      deps.registry.resolve(TOKENS.contact),
      'prepare',
    ).mockImplementation(() => {
      throw new Error('unavailable');
    });
    await user.click(
      screen.getByRole('button', { name: 'PT / EN: mudar para inglês' }),
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Could not prepare the message.',
    );
    expect(screen.getByLabelText('Message to copy')).toHaveValue('');
    expect(screen.getByLabelText('Name')).toHaveValue('Ana Silva');
    await user.click(screen.getByRole('button', { name: 'Copy address' }));
    expect(screen.getByRole('status')).toHaveTextContent('Text copied.');
  });
});
