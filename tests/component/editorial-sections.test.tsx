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
    it('presents two related cases with named technology lists and accurate results', () => {
      renderWithProviders(<Projects />, testDependencies(language).registry);
      expect(
        screen.getByText(language === 'en' ? '03 / PROJECTS' : '03 / PROJETOS'),
      ).toBeInTheDocument();
      const cases = screen.getAllByRole('article');
      expect(cases).toHaveLength(2);
      const [tax, finance] = cases;
      expect(tax).toHaveTextContent('≈98%');
      expect(finance).toHaveTextContent('≈80%');
      for (const item of cases)
        expect(
          within(item).getByRole('group', {
            name:
              language === 'en'
                ? 'Technologies & Integrations'
                : 'Tecnologias e integrações',
          }),
        ).toBeInTheDocument();
      expect(within(tax!).getAllByRole('listitem')).toHaveLength(12);
      expect(within(finance!).getAllByRole('listitem')).toHaveLength(12);
      expect(tax).toHaveTextContent('SEFAZ');
      expect(tax).toHaveTextContent('JavaFX');
      expect(tax).toHaveTextContent('FXML');
      expect(tax).not.toHaveTextContent('HTML');
      expect(within(tax!).getAllByRole('list')).toHaveLength(4);
      expect(within(finance!).getAllByRole('list')).toHaveLength(5);
      expect(tax).not.toHaveTextContent(
        /programação concorrente|concurrent programming/i,
      );
      expect(finance).toHaveTextContent('Spring Boot');
      expect(
        screen.getByText(
          language === 'en' ? /continuous evolution/ : /evolução contínua/,
        ),
      ).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    it('omits the removed concepts and practices from projects and technologies', () => {
      renderWithProviders(
        <>
          <Projects />
          <Technologies />
        </>,
        testDependencies(language).registry,
      );
      expect(document.body).not.toHaveTextContent(
        /programação concorrente|concurrent programming|conceitos e práticas|concepts & practices/i,
      );
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
