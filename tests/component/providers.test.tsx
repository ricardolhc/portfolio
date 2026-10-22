import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Registry, createToken } from '../../src/core/di/registry';
import { DependencyProvider } from '../../src/core/di/dependency-provider';
import { inject, useInject } from '../../src/core/di/inject';
import { usePreferences } from '../../src/presentation/preferences/PreferencesProvider';
import {
  ThemeToggle,
  LanguageSwitcher,
} from '../../src/presentation/components/Controls';
import { renderWithProviders, testDependencies } from '../renderWithProviders';

describe('dependency injection', () => {
  const token = createToken<string>('value');
  function Consumer() {
    return <p>{useInject(token)}</p>;
  }
  it('resolves with inject and useInject, respecting nested providers', () => {
    const a = new Registry().register(token, () => 'outer');
    const b = new Registry().register(token, () => 'inner');
    expect(inject(a, token)).toBe('outer');
    render(
      <DependencyProvider registry={a}>
        <Consumer />
        <DependencyProvider registry={b}>
          <Consumer />
        </DependencyProvider>
      </DependencyProvider>,
    );
    expect(screen.getByText('outer')).toBeInTheDocument();
    expect(screen.getByText('inner')).toBeInTheDocument();
  });
  it('reports missing provider and missing dependency', () => {
    expect(() => render(<Consumer />)).toThrow(
      'useInject requires DependencyProvider',
    );
    expect(() => inject(new Registry(), token)).toThrow(
      'Dependency not registered: value',
    );
  });
});
describe('preferences', () => {
  it('requires its provider', () => {
    function Missing() {
      usePreferences();
      return null;
    }
    expect(() => render(<Missing />)).toThrow(
      'usePreferences requires PreferencesProvider',
    );
  });
  it('toggles both themes and persists manual selection', async () => {
    const deps = testDependencies();
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<ThemeToggle />, deps.registry);
    expect(document.documentElement.dataset.theme).toBe('light');
    await user.click(
      screen.getByRole('button', { name: 'Ativar tema escuro' }),
    );
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(deps.values.get('portfolio.theme')).toBe('dark');
    await user.click(screen.getByRole('button', { name: 'Ativar tema claro' }));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(deps.values.get('portfolio.theme')).toBe('light');
  });
  it('switches language in both directions, updates document metadata and persists', async () => {
    const deps = testDependencies();
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<LanguageSwitcher />, deps.registry);
    expect(screen.getByRole('button')).toHaveAccessibleName(/PT \/ EN/);
    expect(document.documentElement.lang).toBe('pt-BR');
    await user.click(
      screen.getByRole('button', { name: 'PT / EN: mudar para inglês' }),
    );
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('Ricardo Costa — Full Stack Developer');
    expect(deps.values.get('portfolio.language')).toBe('en');
    await user.click(
      screen.getByRole('button', { name: 'PT / EN: switch to Portuguese' }),
    );
    expect(document.documentElement.lang).toBe('pt-BR');
    expect(deps.values.get('portfolio.language')).toBe('pt-BR');
  });
  it('updates existing SEO metadata in both languages', async () => {
    const tags = ['description', 'og:title', 'og:description', 'og:locale'].map(
      (name) => {
        const node = document.createElement('meta');
        node.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.append(node);
        return node;
      },
    );
    const user = userEvent.setup({ delay: null });
    try {
      renderWithProviders(<LanguageSwitcher />);
      expect(tags[0]).toHaveAttribute(
        'content',
        'Desenvolvedor Full Stack com experiência corporativa em React e TypeScript e projetos independentes de automação empresarial. Conheça Ricardo Costa.',
      );
      expect(tags[1]).toHaveAttribute(
        'content',
        'Ricardo Costa — Desenvolvedor Full Stack',
      );
      expect(tags[2]).toHaveAttribute(
        'content',
        'Desenvolvedor Full Stack com experiência corporativa em React e TypeScript e projetos independentes de automação empresarial. Conheça Ricardo Costa.',
      );
      expect(tags[3]).toHaveAttribute('content', 'pt_BR');
      await user.click(
        screen.getByRole('button', { name: 'PT / EN: mudar para inglês' }),
      );
      expect(tags[0]).toHaveAttribute(
        'content',
        'Full Stack Developer with corporate experience in React and TypeScript and independent business automation projects. Meet Ricardo Costa.',
      );
      expect(tags[1]).toHaveAttribute(
        'content',
        'Ricardo Costa — Full Stack Developer',
      );
      expect(tags[2]).toHaveAttribute(
        'content',
        'Full Stack Developer with corporate experience in React and TypeScript and independent business automation projects. Meet Ricardo Costa.',
      );
      expect(tags[3]).toHaveAttribute('content', 'en_US');
    } finally {
      tags.forEach((node) => node.remove());
    }
  });
});
