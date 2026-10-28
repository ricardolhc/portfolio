# Verificação da vitrine de projetos

Validação atualizada em 27/10/2026 após solicitação do proprietário para executar testes, corrigir a ampliação das imagens privadas e publicar os commits.

## Resultados

- `npm run test:unit`: 90 testes aprovados em 6 arquivos.
- `npm test`: 142 testes aprovados em 14 arquivos, incluindo os quatro casos de regressão da preparação das imagens privadas antes da abertura do diálogo.
- `npm run build`: aprovado, incluindo a checagem TypeScript.
- `npm run test:e2e -- --grep 'private project images|project image enlargement|project details support'`: 6 testes aprovados no Chrome. Cobrem imagens privadas carregadas e visíveis em 375 e 1440 px, português e inglês, abertura e reabertura, Escape e restauração de foco, além dos detalhes técnicos.
- ESLint direcionado aos arquivos TypeScript/TSX alterados: aprovado, sem avisos.
- `git diff --check`: sem erros de whitespace.

## Correção da ampliação

A imagem do diálogo permanece montada antes de `showModal()`, sem depender de uma atualização posterior de estado React. O carregamento continua adiado com `loading="lazy"`. O diálogo tem largura explícita limitada ao viewport e a imagem é centralizada, preservando proporção e limites de altura.

O teste de regressão falhou nos quatro casos PT/EN dos dois projetos privados antes da correção e passou depois dela. Nos testes de navegador, a imagem é validada por carregamento completo, dimensões naturais, dimensões de exibição e visibilidade após abrir e reabrir a janela.

## Limites

A suíte completa de Playwright, a auditoria axe em todas as resoluções e os testes de mutação não foram executados nesta validação. Os seis casos de navegador acima passaram; isso não substitui uma auditoria completa de acessibilidade e responsividade.

O lint global havia apontado `no-empty` preexistente em `src/infrastructure/browser.ts:24`; esse arquivo não foi alterado. As capturas empresariais fornecidas pelo proprietário foram preservadas.
