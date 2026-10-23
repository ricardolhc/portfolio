# Atualização das stacks e ferramentas de apoio

Alteração sobre `dd6f8a1`, limitada ao conteúdo técnico e agrupamentos de Projetos e Tecnologias. Português e inglês atualizados. Sem novas dependências, redesign ou alterações de contato, DI, navegação, temas, informações profissionais e acadêmicas.

## Conteúdo e apresentação

- Automação fiscal: HTML substituído por FXML somente nessa stack. Java, JavaFX, FXML e CSS; Apache POI e Jackson; APIs REST, SOAP e SEFAZ; Maven, JUnit e PowerShell, em quatro agrupamentos. Programação concorrente apresentada como prática, sem atribuir ganhos não medidos ou associar SOAP exclusivamente à SEFAZ.
- Gestão financeira: Java, Spring Boot, Spring MVC, Spring Data JPA e Hibernate; Thymeleaf, JavaScript e Bootstrap; PostgreSQL; JUnit e Mockito; Maven, em cinco agrupamentos. Funcionalidades mantidas, com filtros explicitados junto às pesquisas. Nenhuma afirmação de cobertura integral dos módulos.
- Métricas preservadas: aproximadamente 98% no processamento/geração de planilhas e 80% no trabalho manual de gestão de duplicatas e boletos. Resultados continuam abertos, sem moldura fechada.
- Nove categorias gerais, com HTML preservado no front-end e ferramentas novas nas categorias correspondentes. Categoria 09: IA aplicada ao desenvolvimento / AI-Assisted Development, com Claude (Anthropic), OpenAI Codex e GitHub Copilot, descritos apenas como apoio ao desenvolvimento.
- Reutilização das tags existentes. Stacks em listas de definição por finalidade, com quebra natural no mobile; práticas em texto separado, sem card de um único item. Ícone de código monocromático reutilizado para IA.

## Arquivos

- `src/presentation/i18n/messages.ts`: dados, descrições técnicas e traduções.
- `src/presentation/components/PortfolioSections.tsx`: agrupamentos e prática técnica; outras seções preservadas.
- `src/styles.css`: regras locais para stacks, descrição técnica, nota de IA e práticas.
- `tests/unit/project-stacks.test.ts`: oito casos novos PT/EN, stacks exatas, consistência com categorias, métricas e distinção entre prática e ferramenta.
- `tests/unit/professional-content.test.ts`, `tests/component/editorial-sections.test.tsx`, `tests/component/portfolio.test.tsx`, `tests/integration/app.test.tsx`: expectativas atualizadas para novos agrupamentos e nove categorias.
- `tests/browser/portfolio.spec.ts`: categoria 09, ferramentas de IA, grupos das stacks, FXML sem HTML no projeto fiscal e HTML mantido na seção geral.
- `README.md`, `docs/verification.md`, `docs/implementation-ledger.md`: documentação e evidências.

## Verificação

Suíte Vitest: 126 testes em 12 arquivos (90 unitários, 27 de componentes e 9 de integração). Cobertura: 217/217 linhas, 87/87 funções, 241/241 statements e 141/143 branches (98,60%). Branches restantes: preferência de movimento reduzido no jsdom e fallback de ícone para categoria futura; movimento reduzido também exercitado no navegador.

`npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run test:coverage` e `npm run build` passaram. Os três tipos de teste Vitest foram executados juntos pelo comando de cobertura. `npm run test:e2e -- --output reports/technical-stack-e2e-verified` concluiu com 13 testes aprovados em 53,4s. Build: JS 359,65 kB (117,10 kB gzip) e CSS 22,79 kB (5,83 kB gzip).

Playwright verifica 320, 375, 430, 768, 1024 e 1440px em PT/EN e claro/escuro: 24 combinações, sem overflow horizontal ou violações axe nas regras WCAG executadas. Mantém fluxos de navegação, tema/idioma e persistência, certificação, contato com HTTP simulado e movimento normal. Capturas de Projetos e Tecnologias em 375/1440px, ambos os idiomas e temas, estão em `reports/technical-stacks/`, ignorado pelo Git. O header fixo é ocultado somente durante essas capturas de seções, para evitar sobreposição do mecanismo de captura; os testes E2E o verificam normalmente.

Não houve envio ao Formspree real nem publicação remota. Stryker e Lighthouse não foram reexecutados: arquivos de produção no escopo de mutação não mudaram; thresholds e configuração permanecem preservados. O score histórico de 88,54% não é uma nova medição desta alteração.
