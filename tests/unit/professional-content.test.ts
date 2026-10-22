import { describe, expect, it } from 'vitest';
import { messages } from '../../src/presentation/i18n/messages';

describe.each(['pt-BR', 'en'] as const)(
  'professional content in %s',
  (language) => {
    const content = messages[language];
    it('presents practical Full Stack employment separately from independent projects without publishing a duration', () => {
      const [formal, independent] = content.experience.items;
      expect(formal!.title).toBe(
        language === 'en' ? 'Full Stack Developer' : 'Desenvolvedor Full Stack',
      );
      for (const technology of ['React', 'TypeScript', 'Java', 'Node.js'])
        expect(formal!.description).toContain(technology);
      expect(formal!.bullets.at(-1)).toBe(
        language === 'en'
          ? 'System maintenance and evolution.'
          : 'Manutenção e evolução de sistemas.',
      );
      expect(independent!.group).toBe(
        language === 'en' ? 'INDEPENDENT PROJECTS' : 'PROJETOS INDEPENDENTES',
      );
      expect(JSON.stringify(content)).not.toMatch(
        /1 ano e 6 meses|1 year and 6 months|sistemas empresariais|second semester|fourth semester|segundo semestre|quarto semestre/i,
      );
    });
    it('organizes all technologies in six ordered groups with delivery and version control together', () => {
      expect(content.technologies.groups.map((group) => group.title)).toEqual(
        language === 'en'
          ? [
              'Front-end',
              'Back-end',
              'Databases',
              'Version control and CI/CD',
              'Cloud',
              'Testing and quality',
            ]
          : [
              'Front-end',
              'Back-end',
              'Bancos de dados',
              'Versionamento e CI/CD',
              'Cloud',
              'Testes e qualidade',
            ],
      );
      expect(content.technologies.groups.map((group) => group.items)).toEqual([
        ['React', 'TypeScript', 'HTML', 'CSS'],
        ['Java', 'Spring Boot', 'Node.js'],
        ['PostgreSQL', 'MongoDB', 'MySQL'],
        [
          'Git',
          'GitHub',
          'Azure DevOps / Azure Repos',
          'GitHub Actions',
          'Azure Pipelines',
          'GitHub Pages',
        ],
        ['Amazon Web Services (AWS)', 'Microsoft Azure'],
        language === 'en'
          ? [
              'Unit testing',
              'Component testing',
              'Mutation testing',
              'Integration testing',
              'End-to-end (E2E) testing',
            ]
          : [
              'Testes unitários',
              'Testes de componentes',
              'Testes de mutação',
              'Testes de integração',
              'Testes end-to-end (E2E)',
            ],
      ]);
    });
    it('emphasizes existing business processes and preserves measured project outcomes', () => {
      const [tax, financial] = content.projects.items;
      expect(tax!.context).toMatch(
        language === 'en'
          ? /real business process/
          : /processo empresarial real/,
      );
      expect(financial!.context).toMatch(
        language === 'en'
          ? /financial control, payment tracking and management information/
          : /controle financeiro, acompanhamento de pagamentos e geração de informações gerenciais/,
      );
      expect(tax!.metric).toBe('98%');
      expect(financial!.metric).toBe('≈80%');
      expect(financial!.solution).toMatch(
        language === 'en'
          ? /new indicators, reports and management views/
          : /novos indicadores, relatórios e visões gerenciais/,
      );
      expect(content.projects.continuity).toMatch(
        language === 'en'
          ? /developed during my undergraduate degree/
          : /desenvolvidos durante a graduação/,
      );
    });
    it('opens the about section with process improvement and retains practical and academic context', () => {
      expect(content.about.lead).not.toMatch(/Full Stack/);
      for (const technology of ['React', 'TypeScript', 'Java', 'Node.js'])
        expect(content.about.body).toContain(technology);
      expect(content.about.closing).toMatch(
        language === 'en'
          ? /Federal University of Pampa/
          : /Universidade Federal do Pampa/,
      );
      expect(content.about.note).toBe(
        language === 'en'
          ? 'Engineering at the core.\nResults in practice.'
          : 'Engenharia na base.\nResultados na prática.',
      );
    });
  },
);
