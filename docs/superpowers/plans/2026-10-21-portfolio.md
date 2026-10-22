# Portfólio — plano de implementação

> Execução nativa nesta sessão, conforme solicitação de implementação integral. Skills: executing-plans, test-driven-development, verification-before-completion.

**Objetivo:** portfólio profissional funcional, bilíngue, acessível e pronto para GitHub Pages.

**Arquitetura:** contratos pequenos, serviços puros, adapters do navegador e registry configurado no composition root. React Context mantém regras de hooks e permite substituições nos testes.

**Stack:** React, Vite, TypeScript strict, Tailwind, Motion, Vitest/RTL/jsdom, Stryker, ESLint e Prettier.

**Spec:** ../specs/2026-10-21-portfolio-design.md e briefing do usuário.

## Restrições globais

- Não inventar informações profissionais, tecnologias dos projetos ou URLs.
- 1 ano e 6 meses refere-se somente à experiência CLT, conforme outubro de 2026.
- Testes não abrem aplicativo de e-mail real.
- Cobertura: 85% linhas/funções, 80% branches. Mutação: high 85, low 70, break 75.

## Foco de revisão

- Storage bloqueado: manter alternância funcional; teste unitário de adapter.
- Clipboard indisponível: manter texto selecionável; teste de componente.
- E-mail com caracteres especiais: codificar subject/body, impedir injeção de cabeçalhos; teste unitário.
- Preferências persistidas inválidas: detectar ambiente e usar fallback; teste unitário.
- Menu mobile: Escape, fechamento ao navegar e foco utilizável; teste de componente e revisão no navegador.

## Tarefas

- [x] 1. Configuração e domínio. Criar configs; tests/unit/registry.test.ts e contact.test.ts. Ver falhar, implementar src/core/di/registry.ts e src/domain/contact.ts. Tokens tipados, singleton/factory, erros de registro/ciclo; validateContact retorna códigos de erros por campo.
- [x] 2. Serviços e adapters. Testar composeContact, ContactService, PreferenceService, detecção e BrowserPreferences. Implementar src/application, src/infrastructure, src/application/detect-language.ts e composition-root.ts. Testar unicode, limites, storage e erros de dependências.
- [x] 3. Provider e preferências. Testar inject/useInject/DependencyProvider e AppProvider. Implementar Context, alternância, persistência e atualização lang/tema. Executar suíte.
- [x] 4. Interface completa. Testar Header/menu, hero, projetos, tecnologias, experiência, certificações e formulário. Implementar conteúdo centralizado PT/EN, componentes semânticos e CSS responsivo. Validar envio mailto e alternativas de cópia.
- [x] 5. Qualidade. Executar lint, typecheck, testes/cobertura e Stryker. Inspecionar sobreviventes, adicionar testes para lacunas reais e repetir mutação. Revisar UI em 320/375/430/768/1024/1440, tema e teclado; medir Lighthouse quando disponível.
- [x] 6. Entrega. Criar workflows CI/Pages, README e relatório com evidências reais. Revisão final independente solicitada pela skill de execução; corrigir falhas materiais com regressões e verificar build.
