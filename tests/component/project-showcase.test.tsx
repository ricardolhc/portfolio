import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Projects } from '../../src/presentation/components/PortfolioSections';
import { messages } from '../../src/presentation/i18n/messages';
import { renderWithProviders, testDependencies } from '../renderWithProviders';

describe.each(['pt-BR', 'en'] as const)(
  'project showcase in %s',
  (language) => {
    it('separates four concise projects into business and public groups', () => {
      renderWithProviders(<Projects />, testDependencies(language).registry);
      const projects = screen.getAllByRole('article');
      expect(projects).toHaveLength(4);
      expect(
        screen.getByRole('heading', {
          name:
            language === 'en' ? 'Business Solutions' : 'Soluções para empresas',
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          name: language === 'en' ? 'Public Projects' : 'Projetos públicos',
        }),
      ).toBeInTheDocument();
      expect(projects[0]).toHaveTextContent('≈98%');
      expect(projects[1]).toHaveTextContent('≈80%');
      for (const project of projects.slice(0, 2)) {
        expect(within(project).queryByRole('link')).not.toBeInTheDocument();
        expect(within(project).getByRole('img')).toHaveAccessibleName();
      }
      expect(within(projects[0]!).getByRole('img')).toHaveAttribute(
        'src',
        expect.stringContaining('projects/automacao_fiscal.png'),
      );
      expect(within(projects[1]!).getByRole('img')).toHaveAttribute(
        'src',
        expect.stringContaining('projects/gestao_financeira.png'),
      );
      expect(
        within(projects[2]!).getByRole('link', { name: /Play|Jogar/ }),
      ).toHaveAttribute('href', 'https://ricardolhc.github.io/ValorantGuess/');
      expect(
        within(projects[3]!).getByRole('link', { name: /Try It|Experimentar/ }),
      ).toHaveAttribute(
        'href',
        'https://ricardolhc.github.io/rumble-challenge/',
      );
      expect(within(projects[2]!).getByRole('img')).toHaveAttribute(
        'loading',
        'lazy',
      );
      expect(within(projects[3]!).getByRole('img')).toHaveAccessibleName();
    });
    it('allows technical details to be opened independently', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Projects />, testDependencies(language).registry);
      const disclosures = screen.getAllByText(
        language === 'en' ? 'View Details' : 'Ver detalhes',
      );
      await user.click(disclosures[0]!);
      expect(disclosures[0]!.closest('details')).toHaveAttribute('open');
      expect(disclosures[1]!.closest('details')).not.toHaveAttribute('open');
      expect(screen.getAllByRole('article')[0]).toHaveTextContent(
        language === 'en'
          ? 'Concurrent Programming'
          : 'Programação concorrente',
      );
    });
    it('retains complete stacks, public highlights and honors without an academic average', () => {
      const c = messages[language];
      expect(JSON.stringify(c)).not.toMatch(
        /9[,.]13|GPA|média geral|overall average/i,
      );
      expect(c.education.items[1]!.description).toMatch(
        /Láurea Acadêmica|Academic Honors/,
      );
      const all = c.technologies.groups.flatMap((group) => group.items);
      for (const tool of [
        'Vite',
        'Tailwind CSS',
        'Axios',
        'TanStack React Query',
        'Vitest',
        'React Testing Library',
        'ESLint',
        'WebRTC',
        'Fetch API',
        'localStorage',
        'i18next',
        'react-i18next',
      ])
        expect(all).toContain(tool);
      expect(JSON.stringify(c.projects.items[2])).toMatch(/cach/i);
      expect(JSON.stringify(c.projects.items[2])).toMatch(/Vitest/);
      expect(JSON.stringify(c.projects.items[3])).toMatch(/WebRTC/);
      expect(JSON.stringify(c.projects.items[3])).toMatch(/ban/i);
      expect(JSON.stringify(c.projects.items[3])).toMatch(/desafio|challenge/i);
    });
  },
);
