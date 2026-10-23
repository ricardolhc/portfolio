import { describe, expect, it } from 'vitest';
import { messages } from '../../src/presentation/i18n/messages';

describe.each(['pt-BR', 'en'] as const)(
  'confirmed technical stacks in %s',
  (language) => {
    const c = messages[language];
    const english = language === 'en';
    it('replaces only fiscal HTML with FXML and groups the confirmed tools', () => {
      const project = c.projects.items[0]!;
      expect(project.technologyGroups.map((group) => group.items)).toEqual([
        ['Java', 'JavaFX', 'FXML', 'CSS'],
        ['Apache POI', 'Jackson'],
        [
          english ? 'REST APIs' : 'APIs REST',
          'SOAP',
          english ? 'SEFAZ Integration' : 'Integração com SEFAZ',
        ],
        ['Maven', 'JUnit', 'PowerShell'],
      ]);
      const tools = project.technologyGroups.flatMap((group) => group.items);
      expect(tools).not.toContain('HTML');
      for (const text of [
        'Java',
        'JavaFX',
        'FXML',
        'CSS',
        'Apache POI',
        'Jackson',
        'SOAP',
        'Maven',
        'JUnit',
        'PowerShell',
      ])
        expect(project.implementation).toContain(text);
      expect(project.solution).toContain('SEFAZ');
      expect(project.solution).toContain(english ? 'REST APIs' : 'APIs REST');
      expect(project.metric).toBe('≈98%');
    });
    it('preserves the financial stack and adds the confirmed Spring, web, test and build tools', () => {
      const project = c.projects.items[1]!;
      expect(project.technologyGroups.map((group) => group.items)).toEqual([
        ['Java', 'Spring Boot', 'Spring MVC', 'Spring Data JPA', 'Hibernate'],
        ['Thymeleaf', 'JavaScript', 'Bootstrap'],
        ['PostgreSQL'],
        ['JUnit', 'Mockito'],
        ['Maven'],
      ]);
      for (const text of [
        'Java',
        'Spring Boot',
        'Spring MVC',
        'Spring Data JPA',
        'Hibernate',
        'Thymeleaf',
        'JavaScript',
        'Bootstrap',
        'PostgreSQL',
        'Maven',
        'JUnit',
        'Mockito',
      ])
        expect(project.implementation).toContain(text);
      expect(project.metric).toBe('≈80%');
      expect(project.solution).toMatch(
        english ? /smart.*payment/ : /pagamento inteligente/,
      );
      expect(project.solution).toMatch(english ? /filters/ : /filtros/);
    });
    it('adds development assistance as the ninth category, without unverified AI claims', () => {
      expect(c.technologies.groups).toHaveLength(9);
      const ai = c.technologies.groups.at(-1)!;
      expect(ai.title).toBe(
        english ? 'AI-Assisted Development' : 'IA aplicada ao desenvolvimento',
      );
      expect(ai.items).toEqual([
        'Claude (Anthropic)',
        'OpenAI Codex',
        'GitHub Copilot',
      ]);
      expect('description' in ai && ai.description).toMatch(
        english
          ? /support.*software development/
          : /apoio.*desenvolvimento de software/,
      );
      expect(JSON.stringify(ai)).not.toMatch(
        /training|treinamento|machine learning|produtividade|productivity|production|produção/i,
      );
      expect(c.technologies.groups[0]!.items).toContain('HTML');
    });
    it('keeps project tools consistent with the general categories', () => {
      const tools = c.technologies.groups.flatMap((group) => group.items);
      for (const project of c.projects.items) {
        for (const tool of project.technologyGroups.flatMap(
          (group) => group.items,
        )) {
          if (!tool.includes('SEFAZ')) expect(tools).toContain(tool);
        }
      }
    });
  },
);
