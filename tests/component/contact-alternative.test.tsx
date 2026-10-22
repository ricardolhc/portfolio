import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContactActions } from '../../src/presentation/components/ContactActions';
import { LanguageSwitcher } from '../../src/presentation/components/Controls';
import { renderWithProviders, testDependencies } from '../renderWithProviders';

describe('secondary email alternative', () => {
  it.each([
    ['pt-BR', 'Copiar e-mail', 'E-mail copiado'],
    ['en', 'Copy email', 'Email copied'],
  ])(
    'copies the address with accessible feedback in %s',
    async (language, copy, copied) => {
      const deps = testDependencies(language);
      const user = userEvent.setup({ delay: null });
      renderWithProviders(<ContactActions />, deps.registry);
      expect(screen.getByText('contato.ricardolhc@gmail.com')).toBeVisible();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByRole('status')).toBeEmptyDOMElement();
      await user.click(screen.getByRole('button', { name: copy }));
      expect(deps.write).toHaveBeenCalledExactlyOnceWith(
        'contato.ricardolhc@gmail.com',
      );
      expect(screen.getByRole('status')).toHaveTextContent(copied!);
    },
  );
  it('provides a selectable fallback and translates copy failures without losing retry', async () => {
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
    await user.click(screen.getByRole('button', { name: 'Copy email' }));
    expect(screen.getByRole('status')).toHaveTextContent('Email copied');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
