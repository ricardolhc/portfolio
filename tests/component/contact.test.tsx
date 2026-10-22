import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContactActions } from '../../src/presentation/components/ContactActions';
import { LanguageSwitcher } from '../../src/presentation/components/Controls';
import { renderWithProviders, testDependencies } from '../renderWithProviders';

describe('direct contact', () => {
  it.each([
    [
      'pt-BR',
      'Enviar e-mail',
      'Copiar e-mail',
      'Contato%20pelo%20portf%C3%B3lio',
      'E-mail copiado',
    ],
    ['en', 'Send email', 'Copy email', 'Portfolio%20contact', 'Email copied'],
  ])(
    'offers one-click email and accessible copy feedback in %s',
    async (language, send, copy, subject, copied) => {
      const deps = testDependencies(language);
      const user = userEvent.setup({ delay: null });
      renderWithProviders(<ContactActions />, deps.registry);
      expect(
        screen.getByRole('link', { name: new RegExp(send!) }),
      ).toHaveAttribute(
        'href',
        `mailto:contato.ricardolhc@gmail.com?subject=${subject}`,
      );
      expect(
        screen.getByRole('link', { name: new RegExp(send!) }),
      ).toHaveAccessibleDescription(
        language === 'en'
          ? 'The link opens your email application. You write and send the message there.'
          : 'O link abre seu aplicativo de e-mail. Você escreve e conclui o envio por lá.',
      );
      expect(screen.queryByRole('form')).not.toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name:
            language === 'en'
              ? 'Contact email: contato.ricardolhc@gmail.com'
              : 'E-mail de contato: contato.ricardolhc@gmail.com',
        }),
      ).toBeVisible();
      expect(screen.getByRole('status')).toBeEmptyDOMElement();
      await user.click(screen.getByRole('button', { name: copy }));
      expect(deps.write).toHaveBeenCalledExactlyOnceWith(
        'contato.ricardolhc@gmail.com',
      );
      expect(screen.getByRole('status')).toHaveTextContent(copied!);
    },
  );
  it('provides a selectable fallback after denied clipboard access and allows retry', async () => {
    const deps = testDependencies();
    deps.write.mockRejectedValueOnce(new Error('denied'));
    const user = userEvent.setup({ delay: null });
    renderWithProviders(
      <>
        <ContactActions />
        <LanguageSwitcher />
      </>,
      deps.registry,
    );
    await user.click(screen.getByRole('button', { name: 'Copiar e-mail' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      'Selecione e copie o endereço abaixo.',
    );
    const fallback = screen.getByRole('textbox', {
      name: 'E-mail para copiar manualmente',
    });
    expect(fallback).toHaveValue('contato.ricardolhc@gmail.com');
    expect(fallback).toHaveAttribute('readonly');
    await user.click(fallback);
    expect(fallback).toHaveFocus();
    await user.click(
      screen.getByRole('button', { name: 'PT / EN: mudar para inglês' }),
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Select and copy the address below.',
    );
    expect(
      screen.getByRole('textbox', { name: 'Email for manual copying' }),
    ).toHaveValue('contato.ricardolhc@gmail.com');
    await user.click(screen.getByRole('button', { name: 'Copy email' }));
    expect(screen.getByRole('status')).toHaveTextContent('Email copied');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
