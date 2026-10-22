import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../../src/presentation/App';
import { renderWithProviders, testDependencies } from '../renderWithProviders';

describe('professional portfolio', () => {
  it.each([
    [
      'pt-BR',
      'Desenvolvo aplicações e soluções de automação que simplificam processos e resolvem desafios reais de negócios.',
      'Ver certificação',
      'Bancos de dados',
      'Versionamento e ferramentas',
      'CI/CD e deploy',
      'Cloud',
      'Testes e qualidade',
      'Testes unitários',
      'Testes de componentes',
      'Testes de mutação',
      'Testes de integração',
      'Testes end-to-end (E2E)',
      /Graduado em Engenharia de Software pela Universidade Federal do Pampa/,
      /oportunidades profissionais, projetos independentes e soluções sob demanda/,
      /processo já existente mais rápido, simples e eficiente/,
      /novos indicadores, relatórios e visões gerenciais/,
    ],
    [
      'en',
      'I develop applications and automation solutions that simplify processes and solve real business challenges.',
      'View certification',
      'Databases',
      'Version control and tools',
      'CI/CD and deployment',
      'Cloud',
      'Testing and quality',
      'Unit testing',
      'Component testing',
      'Mutation testing',
      'Integration testing',
      'End-to-end (E2E) testing',
      /I hold a degree in Software Engineering from the Federal University of Pampa/,
      /professional opportunities, independent projects and custom software development/,
      /existing process faster, simpler and more efficient/,
      /new indicators, reports and management views/,
    ],
  ] as const)(
    'presents updated business content and categorized skills in %s',
    (language, hero, certification, ...content) => {
      renderWithProviders(<App />, testDependencies(language).registry);
      expect(screen.getByText(hero)).toHaveClass('hero-statement');
      for (const text of content)
        expect(screen.getByText(text)).toBeInTheDocument();
      const link = screen.getByRole('link', {
        name: new RegExp(certification),
      });
      expect(link).toHaveAttribute(
        'href',
        'https://www.linkedin.com/in/ricardo-costa-7a97a3254/overlay/Certifications/327647614/treasury/?profileId=ACoAAD7D1rEB3JC8LRT0evZld_53vA3cctO_IU0',
      );
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(screen.queryByText(/briefing|brief\./i)).not.toBeInTheDocument();
      const experience = screen.getByRole('region', {
        name: /Duas frentes|Two paths/,
      });
      const [formal, independent] = within(experience).getAllByRole('article');
      expect(formal).toHaveTextContent(/1 ano e 6 meses|1 year and 6 months/);
      expect(formal).toHaveTextContent(/carteira assinada|formal employment/i);
      expect(independent).not.toHaveTextContent(
        /1 ano e 6 meses|1 year and 6 months/,
      );
    },
  );
  it('presents hero, real projects, distinct employment, technologies, education and certification', () => {
    renderWithProviders(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Ricardo Costa' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Ricardo Costa — início/ }),
    ).toHaveAccessibleName('rc. Ricardo Costa — início');
    expect(
      screen.getByRole('link', { name: /Explorar projetos/ }),
    ).toHaveAttribute('href', '#projects');
    const experience = screen.getByRole('region', { name: /Duas frentes/ });
    expect(
      within(experience).getByText('EXPERIÊNCIA FORMAL · CLT'),
    ).toBeInTheDocument();
    expect(within(experience).getByText('1 ano e 6 meses')).toBeInTheDocument();
    expect(
      within(experience).getByText('PROJETOS INDEPENDENTES'),
    ).toBeInTheDocument();
    const projects = screen.getByRole('region', {
      name: /Menos trabalho manual/,
    });
    expect(within(projects).getAllByRole('article')).toHaveLength(2);
    expect(within(projects).getByText('98%')).toBeInTheDocument();
    expect(within(projects).getByText('≈80%')).toBeInTheDocument();
    expect(
      within(projects).getByText(
        /novos indicadores, relatórios e visões gerenciais/,
      ),
    ).toBeInTheDocument();
    const technologies = screen.getByRole('region', {
      name: /Ferramentas para/,
    });
    for (const tech of [
      'React',
      'TypeScript',
      'HTML',
      'CSS',
      'Java',
      'Spring Boot',
      'Node.js',
      'PostgreSQL',
      'MongoDB',
      'MySQL',
      'Git',
      'GitHub',
      'Azure DevOps / Azure Repos',
      'GitHub Actions',
      'GitHub Pages',
      'Azure Pipelines',
      'Microsoft Azure',
      'Amazon Web Services (AWS)',
      'Testes unitários',
      'Testes de componentes',
      'Testes de mutação',
      'Testes de integração',
      'Testes end-to-end (E2E)',
    ])
      expect(within(technologies).getByText(tech)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Mestrado em Engenharia de Software',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Graduação concluída')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'AWS Certified Cloud Practitioner' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Categoria Foundational')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /currículo|download/i }),
    ).not.toBeInTheDocument();
  });
  it('provides accessible navigation and closes the mobile menu on navigation or Escape', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<App />);
    const open = screen.getByRole('button', { name: 'Abrir menu' });
    expect(open).toHaveAttribute('aria-expanded', 'false');
    await user.click(open);
    expect(open).toHaveAttribute('aria-expanded', 'true');
    const nav = screen.getByRole('navigation', { name: 'Navegação principal' });
    expect(open.getAttribute('aria-controls')).toBe(nav.id);
    await user.keyboard('a');
    expect(open).toHaveAttribute('aria-expanded', 'true');
    for (const [name, id] of [
      ['Sobre', 'about'],
      ['Experiência', 'experience'],
      ['Projetos', 'projects'],
      ['Contato', 'contact'],
    ])
      expect(within(nav).getByRole('link', { name })).toHaveAttribute(
        'href',
        `#${id}`,
      );
    await user.click(within(nav).getByRole('link', { name: 'Projetos' }));
    expect(open).toHaveAttribute('aria-expanded', 'false');
    await user.click(open);
    await user.keyboard('{Escape}');
    expect(open).toHaveAttribute('aria-expanded', 'false');
    expect(open).toHaveFocus();
    await user.click(open);
    await user.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(open).toHaveAttribute('aria-expanded', 'false');
    await user.keyboard('{Escape}');
    expect(open).toHaveAttribute('aria-expanded', 'false');
    const themeButton = screen.getByRole('button', {
      name: 'Ativar tema escuro',
    });
    themeButton.focus();
    await user.keyboard('{Escape}');
    expect(themeButton).toHaveFocus();
  });
  it('translates the entire visitor experience', async () => {
    renderWithProviders(<App />, testDependencies('en', 'dark').registry);
    for (const title of [
      /Two paths/,
      /Less manual work/,
      /Tools to build/,
      /Where practice/,
      /Solid foundations/,
      /Your next project/,
    ])
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    expect(
      screen.getByText('Full Stack Developer', { selector: '.hero-role' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Switch to light theme' }),
    ).toBeInTheDocument();
    for (const link of screen.getAllByRole('link', { name: /GitHub/ }))
      expect(link).toHaveAttribute('href', 'https://github.com/ricardolhc');
    expect(
      screen.getByRole('link', { name: /Send email/ }),
    ).toBeInTheDocument();
  });
});
