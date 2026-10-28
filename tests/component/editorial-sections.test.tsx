import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Projects,
  Technologies,
  Certifications,
} from '../../src/presentation/components/PortfolioSections';
import { renderWithProviders, testDependencies } from '../renderWithProviders';

describe.each(['pt-BR', 'en'] as const)(
  'editorial sections in %s',
  (language) => {
    it('presents four projects with named stacks, compact details and accurate business results', () => {
      renderWithProviders(<Projects />, testDependencies(language).registry);
      const cases = screen.getAllByRole('article');
      expect(cases).toHaveLength(4);
      expect(cases[0]).toHaveTextContent('≈98%');
      expect(cases[1]).toHaveTextContent('≈80%');
      expect(cases[0]).toHaveTextContent('FXML');
      expect(cases[0]).not.toHaveTextContent('HTML');
      for (const item of cases)
        expect(
          within(item).getByRole('group', {
            name: language === 'en' ? 'Technologies' : 'Tecnologias',
          }),
        ).toBeInTheDocument();
      expect(
        screen.getByText(
          language === 'en' ? /continuous evolution/ : /evolução contínua/,
        ),
      ).toBeInTheDocument();
    });
    it('keeps all nine category headings and their technology lists', () => {
      renderWithProviders(
        <Technologies />,
        testDependencies(language).registry,
      );
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(9);
      expect(screen.getAllByRole('list')).toHaveLength(9);
      for (const technology of [
        'JavaFX',
        'React',
        'PostgreSQL',
        'GitHub Pages',
        'Amazon Web Services (AWS)',
        'Jest',
        'OpenLens',
        'Claude (Anthropic)',
        'OpenAI Codex',
        'GitHub Copilot',
      ])
        expect(screen.getByText(technology)).toBeInTheDocument();
    });
    it('uses a local AWS logo and preserves the real credential action', () => {
      renderWithProviders(
        <Certifications />,
        testDependencies(language).registry,
      );
      const logo = screen.getByRole('img', {
        name: 'Amazon Web Services (AWS)',
      });
      expect(logo.getAttribute('src')).toMatch(
        /^(data:image\/svg\+xml|\/.*aws-logo.*\.svg)/,
      );
      expect(logo.getAttribute('src')).not.toMatch(/^https?:/);
      expect(
        screen.getByRole('heading', {
          name: 'AWS Certified Cloud Practitioner',
        }),
      ).toBeInTheDocument();
      expect(screen.getByText('Foundational')).toBeInTheDocument();
      expect(
        screen.getByText('Amazon Web Services', { exact: true }),
      ).toBeInTheDocument();
      const link = screen.getByRole('link', {
        name: language === 'en' ? /View Credential/ : /Ver certificação/,
      });
      expect(link).toHaveAttribute(
        'href',
        'https://cp.certmetrics.com/amazon/en/public/verify/credential/f844a9917d974a3bb153aeb58edf6d2c',
      );
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  },
);
