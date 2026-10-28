import { describe, expect, it } from 'vitest';
import { messages } from '../../src/presentation/i18n/messages';

const currentStack = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'MongoDB',
  'Redis',
  'Postman',
  'Jest',
  'Stryker',
  'GA4',
  'Git',
  'Kubernetes',
  'Argo',
  'OpenLens',
];
const internshipStack = [
  'React',
  'JavaScript',
  'Node.js',
  'Express.js',
  'MongoDB',
  'AWS EC2',
  'AWS S3',
  'Git',
  'Scrum',
];

describe.each(['pt-BR', 'en'] as const)(
  'professional content in %s',
  (language) => {
    const c = messages[language];
    it('separates current employment, the internship and independent services', () => {
      expect(c.experience.items).toHaveLength(2);
      const [corporate, independent] = c.experience.items;
      expect(corporate!.title).toBe(
        language === 'en' ? 'Software Developer' : 'Desenvolvedor',
      );
      expect(corporate!.details).toContain('Compass UOL');
      expect(corporate!.details).toContain('2025');
      expect(corporate!.details).toMatch(
        language === 'en' ? /May.*present.*Remote/ : /maio.*atualmente.*Remoto/,
      );
      expect(corporate!.technologies).toEqual(currentStack);
      expect(corporate!.technologies).not.toContain('Java');
      expect(corporate!.additionalRoles).toHaveLength(1);
      const internship = corporate!.additionalRoles[0]!;
      expect(internship.title).toBe(
        language === 'en'
          ? 'Full Stack Developer — Internship'
          : 'Desenvolvedor Full Stack — Estágio',
      );
      expect(internship.details).toMatch(
        language === 'en'
          ? /July 2024.*December 2024/
          : /julho de 2024.*dezembro de 2024/,
      );
      expect(internship.technologies).toEqual(internshipStack);
      expect(internship.details).not.toContain('CLT');
      expect(independent!.details).toBe('');
      expect(independent!.additionalRoles).toHaveLength(0);
      expect(JSON.stringify(independent)).toContain('SEFAZ');
      expect(JSON.stringify(independent)).not.toMatch(/Compass|2024|2025|2026/);
      expect(c.experience.items.map((item) => item.group)).toEqual(
        language === 'en'
          ? ['CORPORATE EXPERIENCE', 'INDEPENDENT PROJECTS']
          : ['EXPERIÊNCIA CORPORATIVA', 'PROJETOS INDEPENDENTES'],
      );
    });
    it('associates the confirmed technologies and metrics with the correct business process', () => {
      const [tax, finance] = c.projects.items;
      expect(tax!.description).toContain('SEFAZ');
      expect(tax!.description).toContain(
        language === 'en' ? 'REST APIs' : 'APIs REST',
      );
      expect(tax!.technologyGroups.flatMap((group) => group.items)).toEqual([
        'Java',
        'JavaFX',
        'FXML',
        'CSS',
        'Apache POI',
        'Jackson',
        language === 'en' ? 'REST APIs' : 'APIs REST',
        'SOAP',
        language === 'en' ? 'SEFAZ Integration' : 'Integração com SEFAZ',
        'Maven',
        'JUnit',
        'PowerShell',
        language === 'en'
          ? 'Concurrent Programming'
          : 'Programação concorrente',
      ]);
      expect(tax!.metric).toBe('≈98%');
      expect(tax!.result).toMatch(
        language === 'en'
          ? /processing.*spreadsheet/
          : /processamento.*planilhas/,
      );
      expect(finance!.technologyGroups.flatMap((group) => group.items)).toEqual(
        [
          'Java',
          'Spring Boot',
          'Spring MVC',
          'Spring Data JPA',
          'Hibernate',
          'Thymeleaf',
          'JavaScript',
          'Bootstrap',
          'PostgreSQL',
          'JUnit',
          'Mockito',
          'Maven',
        ],
      );
      expect(finance!.metric).toBe('≈80%');
      expect(finance!.result).toMatch(
        language === 'en' ? /payables.*payment slip/ : /duplicatas.*boletos/,
      );
      expect(finance!.description).toMatch(
        language === 'en' ? /batch|bulk/ : /lote/,
      );
      expect(finance!.description).toMatch(
        language === 'en' ? /smart.*payment/i : /pagamento inteligente/,
      );
      expect(c.projects.eyebrow).toBe(
        language === 'en' ? '03 / PROJECTS' : '03 / PROJETOS',
      );
      expect(c.certifications.reference).toBe(
        language === 'en' ? 'View Credential' : 'Ver certificação',
      );
      expect(c.projects.continuity).toMatch(
        language === 'en' ? /evolution/ : /evolução/,
      );
      expect(JSON.stringify(c.projects)).not.toMatch(
        /\bPOST\b|\bGET\b|github\.com/,
      );
    });
    it('keeps nine clear technology groups without duplicate items or proficiency claims', () => {
      const groups = c.technologies.groups;
      expect(groups.map((group) => group.title)).toEqual(
        language === 'en'
          ? [
              'Front-end',
              'Back-end and APIs',
              'Desktop Development & Automation',
              'Databases and cache',
              'Version Control, Build & CI/CD',
              'Cloud',
              'Software Testing & Quality',
              'Analytics and application infrastructure',
              'AI-Assisted Development',
            ]
          : [
              'Front-end',
              'Back-end e APIs',
              'Desenvolvimento Desktop e Automação',
              'Bancos de dados e cache',
              'Versionamento, build e CI/CD',
              'Cloud',
              'Testes e qualidade de software',
              'Analytics e infraestrutura de aplicações',
              'IA aplicada ao desenvolvimento',
            ],
      );
      const all = groups.flatMap((group) => group.items);
      expect(new Set(all).size).toBe(all.length);
      for (const tech of [
        'JavaScript',
        'Thymeleaf',
        'Express.js',
        'JavaFX',
        'Redis',
        'Jest',
        'Stryker',
        'Postman',
        'Google Analytics 4 (GA4)',
        'Kubernetes',
        'Argo',
        'OpenLens',
        'GitHub Pages',
        'Azure Pipelines',
      ])
        expect(all).toContain(tech);
      expect(JSON.stringify(groups)).not.toMatch(/\d%|expert|especialista/i);
    });
    it('records applied postgraduate study, academic honors and a concise IFAM foundation', () => {
      const [master, bachelor, technical] = c.education.items;
      expect(master!.title).toMatch(
        language === 'en' ? /Professional Master/ : /Mestrado Profissional/,
      );
      expect(master!.period).toMatch(/2026.*2027/);
      expect(master!.status).toBe(
        language === 'en' ? 'In progress' : 'Em andamento',
      );
      expect(master!.institution).toBe(
        'Universidade Federal do Pampa (UNIPAMPA)',
      );
      expect(bachelor!.period).toMatch(/2022.*2025/);
      expect(bachelor!.description).toContain('Láurea Acadêmica');
      expect(bachelor!.description).not.toMatch(
        /9[,.]13|GPA|overall average|média geral/i,
      );
      expect(bachelor!.description).toContain('FAPERGS');
      expect(technical!.institution).toBe(
        'Instituto Federal de Educação, Ciência e Tecnologia do Amazonas (IFAM)',
      );
      expect(technical!.period).toMatch(/2018.*2021/);
      expect(technical!.description).toContain('Arduino');
      expect(technical!.description).toContain('LEGO Mindstorms EV3');
      expect(JSON.stringify(c.education)).not.toMatch(
        /GPA|TCC|thesis|dissertação/i,
      );
    });
    it('presents corporate and independent work in about and keeps the contact contract intact', () => {
      const about = JSON.stringify(c.about);
      for (const text of [
        'Compass UOL',
        'React',
        'TypeScript',
        'Java',
        'Spring Boot',
        'Node.js',
        '98%',
        '80%',
        'Láurea Acadêmica',
      ])
        expect(about).toContain(text);
      expect(c.contact.fields.email).toBe(
        language === 'en' ? 'Best email to reach you' : 'Seu melhor e-mail',
      );
      expect(c.hero.statement).toContain(
        language === 'en' ? 'integrate systems' : 'integram sistemas',
      );
      expect(JSON.stringify(c)).not.toMatch(
        /1 ano e 6 meses|1 year and 6 months/,
      );
    });
  },
);
