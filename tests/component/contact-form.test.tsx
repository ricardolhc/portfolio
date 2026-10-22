import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContactForm } from '../../src/presentation/components/ContactForm';
import { LanguageSwitcher } from '../../src/presentation/components/Controls';
import { ContactGatewayError } from '../../src/domain/contact';
import { renderWithProviders, testDependencies } from '../renderWithProviders';

const fields = ['Nome', 'E-mail', 'Assunto', 'Mensagem'];
const values = [
  'Ana Silva',
  'ana@example.com',
  'Integração & software',
  'Olá Ricardo,\nvamos automatizar um processo?',
];
async function fill(user: ReturnType<typeof userEvent.setup>, labels = fields) {
  for (const [index, label] of labels.entries())
    await user.type(
      screen.getByRole('textbox', { name: label }),
      values[index]!.replaceAll('\n', '{Enter}'),
    );
}
describe('Formspree contact form', () => {
  it.each([
    [
      'pt-BR',
      fields,
      'Enviar mensagem',
      'Mensagem enviada com sucesso! Obrigado pelo contato. Responderei assim que possível.',
    ],
    [
      'en',
      ['Name', 'Email', 'Subject', 'Message'],
      'Send message',
      'Message sent successfully! Thank you for getting in touch. I’ll reply as soon as possible.',
    ],
  ] as const)(
    'renders and sends the four fields in %s',
    async (language, labels, button, success) => {
      const deps = testDependencies(language);
      const user = userEvent.setup({ delay: null });
      renderWithProviders(<ContactForm />, deps.registry);
      expect(screen.getAllByRole('textbox')).toHaveLength(4);
      for (const [index, label] of labels.entries()) {
        const input = screen.getByRole('textbox', { name: label });
        expect(input).toBeRequired();
        expect(input).toHaveValue('');
        expect(input).toHaveAccessibleDescription(
          language === 'en'
            ? 'All fields are required.'
            : 'Todos os campos são obrigatórios.',
        );
        expect(input).toHaveAttribute(
          'maxlength',
          String([100, 254, 160, 5000][index]),
        );
      }
      expect(screen.getByRole('textbox', { name: labels[0] })).toHaveAttribute(
        'autocomplete',
        'name',
      );
      expect(screen.getByRole('textbox', { name: labels[1] })).toHaveAttribute(
        'type',
        'email',
      );
      expect(screen.getByRole('textbox', { name: labels[1] })).toHaveAttribute(
        'autocomplete',
        'email',
      );
      expect(screen.getByRole('textbox', { name: labels[2] })).toHaveAttribute(
        'autocomplete',
        'off',
      );
      expect(screen.getByRole('button', { name: button })).toBeEnabled();
      await fill(user, [...labels]);
      await user.click(screen.getByRole('button', { name: button }));
      expect(deps.send).toHaveBeenCalledExactlyOnceWith({
        name: values[0],
        email: values[1],
        subject: values[2],
        message: values[3],
      });
      expect(
        screen.getByRole('status', {
          name: language === 'en' ? 'Message status' : 'Status da mensagem',
        }),
      ).toHaveTextContent(success);
      for (const label of labels)
        expect(screen.getByRole('textbox', { name: label })).toHaveValue('');
      expect(
        screen.queryByRole('link', { name: /Enviar e-mail|Send email/ }),
      ).not.toBeInTheDocument();
    },
  );
  it('associates validation with fields, focuses the first error and preserves unrelated errors on edit', async () => {
    const deps = testDependencies();
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<ContactForm />, deps.registry);
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(screen.getAllByText('Campo obrigatório.')).toHaveLength(4);
    expect(
      screen.getByRole('status', { name: 'Status da mensagem' }),
    ).toHaveTextContent('Revise os campos indicados.');
    const name = screen.getByRole('textbox', { name: 'Nome' });
    expect(name).toHaveFocus();
    for (const label of fields) {
      expect(screen.getByRole('textbox', { name: label })).toHaveAttribute(
        'aria-invalid',
        'true',
      );
      expect(
        screen.getByRole('textbox', { name: label }),
      ).toHaveAccessibleDescription('Campo obrigatório.');
    }
    await user.type(name, 'Ana');
    expect(name).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByRole('textbox', { name: 'Assunto' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await user.type(
      screen.getByRole('textbox', { name: 'E-mail' }),
      'not-an-email',
    );
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveFocus();
    expect(
      screen.getByRole('textbox', { name: 'E-mail' }),
    ).toHaveAccessibleDescription('Informe um e-mail válido.');
    expect(deps.send).not.toHaveBeenCalled();
  });
  it('preserves data while pending, blocks duplicate events, and only clears after acknowledgement', async () => {
    const deps = testDependencies();
    let finish!: () => void;
    deps.send.mockReturnValue(
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
    );
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<ContactForm />, deps.registry);
    await fill(user);
    const form = screen.getByRole('form', { name: 'Formulário de contato' });
    const submission = new Event('submit', { bubbles: true, cancelable: true });
    fireEvent(form, submission);
    expect(submission.defaultPrevented).toBe(true);
    fireEvent.submit(form);
    expect(deps.send).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Enviando...' })).toBeDisabled();
    expect(form).toHaveAttribute('aria-busy', 'true');
    expect(
      screen.queryByText(/Mensagem enviada com sucesso/),
    ).not.toBeInTheDocument();
    for (const [index, label] of fields.entries()) {
      expect(screen.getByRole('textbox', { name: label })).toBeDisabled();
      expect(screen.getByRole('textbox', { name: label })).toHaveValue(
        values[index],
      );
    }
    await user.click(screen.getByRole('button', { name: 'Copiar e-mail' }));
    expect(
      screen.getByRole('status', { name: 'Status da cópia' }),
    ).toHaveTextContent('E-mail copiado');
    await act(async () => finish());
    expect(form).toHaveAttribute('aria-busy', 'false');
    expect(
      screen.getByRole('status', { name: 'Status da mensagem' }),
    ).toHaveTextContent(/Mensagem enviada com sucesso/);
    expect(
      screen.getByRole('button', { name: 'Enviar mensagem' }),
    ).toBeEnabled();
    await user.type(
      screen.getByRole('textbox', { name: 'Nome' }),
      'Outro contato',
    );
    expect(
      screen.getByRole('status', { name: 'Status da mensagem' }),
    ).toBeEmptyDOMElement();
  });
  it('preserves rejected content, translates the error and allows successful retry', async () => {
    const deps = testDependencies();
    deps.send.mockRejectedValueOnce(new Error('private server detail'));
    const user = userEvent.setup({ delay: null });
    renderWithProviders(
      <>
        <ContactForm />
        <LanguageSwitcher />
      </>,
      deps.registry,
    );
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(
      screen.getByRole('status', { name: 'Status da mensagem' }),
    ).toHaveTextContent(
      'Não foi possível enviar sua mensagem. Tente novamente ou entre em contato diretamente pelo e-mail.',
    );
    expect(screen.queryByText(/private server detail/)).not.toBeInTheDocument();
    for (const [index, label] of fields.entries())
      expect(screen.getByRole('textbox', { name: label })).toHaveValue(
        values[index],
      );
    await user.click(
      screen.getByRole('button', { name: 'PT / EN: mudar para inglês' }),
    );
    expect(
      screen.getByRole('status', { name: 'Message status' }),
    ).toHaveTextContent(
      'Could not send your message. Please try again or contact me directly by email.',
    );
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(
      screen.getByRole('status', { name: 'Message status' }),
    ).toHaveTextContent(/Message sent successfully/);
    expect(deps.send).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
  });
  it('shows safe rate-limit feedback', async () => {
    const deps = testDependencies();
    deps.send.mockRejectedValueOnce(new ContactGatewayError('rateLimited'));
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<ContactForm />, deps.registry);
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(
      screen.getByRole('status', { name: 'Status da mensagem' }),
    ).toHaveTextContent(/Muitas tentativas/);
    expect(screen.getByRole('textbox', { name: 'Mensagem' })).toHaveValue(
      values[3],
    );
  });
  it('does not send honeypot submissions or pretend they succeeded', async () => {
    const deps = testDependencies();
    const user = userEvent.setup({ delay: null });
    const { container } = renderWithProviders(<ContactForm />, deps.registry);
    await fill(user);
    const honeypot =
      container.querySelector<HTMLInputElement>('[name="_gotcha"]')!;
    fireEvent.input(honeypot, { target: { value: 'spam' } });
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(deps.send).not.toHaveBeenCalled();
    expect(
      screen.getByRole('status', { name: 'Status da mensagem' }),
    ).toHaveTextContent(/Não foi possível enviar/);
    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue(
      values[0],
    );
    fireEvent.input(honeypot, { target: { value: '' } });
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(deps.send).toHaveBeenCalledTimes(1);
  });
});
