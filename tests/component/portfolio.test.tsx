import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../../src/presentation/App';
import { renderWithProviders, testDependencies } from '../renderWithProviders';

describe('professional portfolio', () => {
  it.each(['pt-BR', 'en'] as const)(
    'presents accurate corporate roles, independent projects and education in %s',
    (language) => {
      const en = language === 'en';
      renderWithProviders(<App />, testDependencies(language).registry);
      expect(
        screen.getByRole('heading', { level: 1, name: 'Ricardo Costa' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name: en ? /Ricardo Costa — home/ : /Ricardo Costa — início/,
        }),
      ).toHaveAccessibleName(
        en ? 'rc. Ricardo Costa — home' : 'rc. Ricardo Costa — início',
      );
      expect(
        screen.getByRole('link', {
          name: en ? /Explore projects/ : /Explorar projetos/,
        }),
      ).toHaveAttribute('href', '#projects');
      expect(
        screen.getByText(
          en
            ? 'I develop web applications and automation solutions that simplify processes, integrate systems and solve real business challenges.'
            : 'Desenvolvo aplicações web e soluções de automação que simplificam processos, integram sistemas e resolvem desafios reais de negócios.',
        ),
      ).toHaveClass('hero-statement');
      const experience = screen.getByRole('region', {
        name: /Duas frentes|Two paths/,
      });
      const cards = within(experience).getAllByRole('article');
      expect(cards).toHaveLength(2);
      const [corporate, independent] = cards;
      expect(
        within(corporate!).getByRole('heading', {
          name: en ? 'Software Developer' : 'Desenvolvedor',
        }),
      ).toBeInTheDocument();
      expect(
        within(corporate!).getByRole('heading', {
          name: en
            ? 'Full Stack Developer — Internship'
            : 'Desenvolvedor Full Stack — Estágio',
        }),
      ).toBeInTheDocument();
      expect(within(corporate!).getAllByText(/Compass UOL/)).toHaveLength(2);
      for (const tech of [
        'Redis',
        'Kubernetes',
        'OpenLens',
        'AWS EC2',
        'AWS S3',
      ])
        expect(corporate).toHaveTextContent(tech);
      expect(corporate).not.toHaveTextContent('SEFAZ');
      expect(independent).toHaveTextContent('SEFAZ');
      expect(independent).not.toHaveTextContent('Compass UOL');
      expect(independent).not.toHaveTextContent(/2024|2025|2026/);
      const projects = screen.getByRole('region', {
        name: /Menos trabalho manual|Less manual work/,
      });
      const [tax, financial] = within(projects).getAllByRole('article');
      expect(tax).toHaveTextContent('SEFAZ');
      expect(tax).toHaveTextContent('JavaFX');
      expect(tax).toHaveTextContent('≈98%');
      expect(financial).toHaveTextContent('≈80%');
      for (const tech of ['Spring Boot', 'Thymeleaf', 'PostgreSQL'])
        expect(financial).toHaveTextContent(tech);
      expect(financial).not.toHaveTextContent('JavaFX');
      const technologies = screen.getByRole('region', {
        name: /Tecnologias e práticas|Technologies and practices/,
      });
      expect(
        within(technologies).getAllByRole('heading', { level: 3 }),
      ).toHaveLength(9);
      for (const tech of [
        'React',
        'TypeScript',
        'JavaScript',
        'HTML',
        'CSS',
        'Thymeleaf',
        'Java',
        'Spring Boot',
        'Node.js',
        'Express.js',
        'JavaFX',
        'PostgreSQL',
        'MongoDB',
        'MySQL',
        'Redis',
        'Git',
        'GitHub',
        'Azure DevOps / Azure Repos',
        'GitHub Actions',
        'GitHub Pages',
        'Azure Pipelines',
        'Microsoft Azure',
        'Amazon Web Services (AWS)',
        'Jest',
        'Stryker',
        'Postman',
        'Google Analytics 4 (GA4)',
        'Kubernetes',
        'Argo',
        'OpenLens',
      ])
        expect(within(technologies).getByText(tech)).toBeInTheDocument();
      const education = screen.getByRole('region', {
        name: /A prática encontra|Where practice/,
      });
      expect(within(education).getAllByRole('article')).toHaveLength(3);
      expect(education).toHaveTextContent(
        en ? 'Academic Honors (Láurea Acadêmica)' : 'Láurea Acadêmica',
      );
      expect(education).not.toHaveTextContent(
        /9[,.]13|GPA|média geral|overall average/i,
      );
      expect(education).toHaveTextContent('FAPERGS');
      expect(education).toHaveTextContent('IFAM');
      expect(education).toHaveTextContent(
        en
          ? 'Professional Master’s Degree in Software Engineering'
          : 'Mestrado Profissional em Engenharia de Software',
      );
      expect(education).toHaveTextContent(en ? 'In progress' : 'Em andamento');
      expect(
        screen.getByRole('textbox', {
          name: en ? 'Best email to reach you' : 'Seu melhor e-mail',
        }),
      ).toHaveAttribute('type', 'email');
      const certification = screen.getByRole('link', {
        name: en ? /View Credential/ : /Ver certificação/,
      });
      expect(certification).toHaveAttribute(
        'href',
        'https://cp.certmetrics.com/amazon/en/public/verify/credential/f844a9917d974a3bb153aeb58edf6d2c',
      );
      expect(certification).toHaveAttribute('target', '_blank');
      expect(certification).toHaveAttribute('rel', 'noopener noreferrer');
      expect(
        screen.queryByText(/1 ano e 6 meses|1 year and 6 months|briefing/),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: /currículo|download/i }),
      ).not.toBeInTheDocument();
    },
  );
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
      /Technologies and practices/,
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
      screen.getByRole('button', { name: 'Send message' }),
    ).toBeInTheDocument();
  });
});
