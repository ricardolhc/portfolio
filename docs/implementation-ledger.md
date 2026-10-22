# Registro de execução

- Repositório inicialmente vazio, sem commits, sem remote e sem AGENTS.md aplicável. Trabalho na branch local `feat/portfolio`, no checkout solicitado.
- Briefing completo usado como autorização para executar sem novas aprovações de design. Spec e plano registram as escolhas.
- Inicialização: npm 11.19.1 apresentou erro interno Arborist ao resolver versões flutuantes Vitest/coverage; fixar ambos em 4.1.12 resolveu a instalação. `npm ls` confirmou Stryker 10.0.0 e peers consistentes.
- Primeira execução registrou falhas pela ausência dos módulos especificados nos testes. Após implementação dos serviços, 46 testes unitários passaram.
- Testes de componentes detectaram label com asterisco, ausência de IntersectionObserver no jsdom, espaço ausente na quebra de linha da certificação e consultas de teste ambíguas. Labels simplificados, API de observação simulada e asserções corrigidas sem simular as funcionalidades testadas.
- Primeira suíte completa verde: 62 testes; 100% linhas/funções, 97,43% branches. Build Vite passou.
- Auditoria npm: correção transitiva disponível aplicada, sem vulnerabilidades no momento da execução.
- DI pragmática: dados profissionais estáticos não ganharam um repositório artificial. Serviços e adapters substituíveis por tokens; detecção de idioma fica em application, evitando dependência dessa camada na presentation.
- Integração CUA não expôs navegadores. Validação automatizada do próprio aplicativo usará Chrome instalado via ferramentas de teste, sem interagir com sessões pessoais.
- Interface completa: 51 testes unitários + 17 de componentes passaram. Cobertura: 100% linhas/funções/statements, 99,14% branches.
- Playwright: 7 testes passaram; 24 combinações de largura/tema/idioma sem overflow e sem violações axe nas regras executadas. Capturas reais mobile e desktop inspecionadas.
- Lighthouse inicial 96/100/100/100. Preload de Geist e nomes acessíveis foram corrigidos com regressões. Medição final: 99/100/100/100, CLS 0.
- Stryker inicial 76,04%; lacunas reais motivaram fortalecimento de testes. Segunda execução completa: 88,05%, 337 mortos, 2 timeouts, 46 sobreviventes, zero sem cobertura e 1 RuntimeError do runner. Sem novas exclusões. Análise em verification.md.
- Associação acessível de erro no textarea ganhou uma asserção após a análise dos sobreviventes, com confirmação incremental do Stryker.
- Confirmação incremental concluída: 88,31%, 338 mortos, 2 timeouts, 45 sobreviventes, zero sem cobertura, 1 RuntimeError. Mutante 255 passou de sobrevivente a morto. Foram reutilizados 266 resultados e reexecutados 120, sem alteração de produção.
- Build com fixture reservada .invalid: assets, favicon, preload, canonical e sitemap passaram com subcaminho. Build local continua sem URLs presumidas.
- Revisão independente final: os dois apontamentos factuais foram retirados após confronto com os trechos exatos do briefing. Sem achados materiais. Melhoria visual opcional documentada: theme-color do navegador permanece claro.
- CI/Pages e README entregues; tags das ações verificadas nos repositórios oficiais. Não há remote Git; nenhuma publicação nem execução remota foi alegada.
- Trabalho preservado na branch local feat/portfolio e no checkout solicitado. Não existe branch-base anterior com commits para mesclar.

## Conferência adicional — 22 de outubro de 2026

- Solicitação: verificar se restava algo para implementar. Briefing confrontado com conteúdo, seções, arquitetura, scripts, testes, SEO e workflows. Mapeamento em requirements-audit.md.
- Quatro regressões observadas antes das correções: theme-color não sincronizado, falha de composição por submit/cópia e falha de prévia ao trocar idioma.
- Preparação, prévia e cópia corrigidas com preservação dos campos e feedback PT/EN. Theme-color acompanha a preferência inicial e trocas manuais.
- Teste de ciclo ganhou um limite de recursão no fixture, para que remoção da proteção seja detectada por asserção em vez de timeout.
- Verificação após correções: 72 testes passaram, cobertura 100% linhas/funções/statements e 99,21% branches. Lint, tipos, formatação e build passaram.
- Playwright: 7 testes passaram, agora incluindo theme-color nas 24 combinações de largura/tema/idioma.
- Lighthouse atualizado: 99/100/100/100, CLS 0.
- Inglês do processo financeiro ajustado de receivables para payables, em coerência com as notas fiscais de entrada e pagamentos do briefing. Nenhum dado profissional novo foi acrescentado.
- Stryker completo: 413 mutantes, 88,38%, 365 mortos e 48 sobreviventes; nenhum timeout, erro de runner ou mutante sem cobertura. Asserções adicionais de recuperação e preservação da prévia motivaram confirmação incremental: 89,10%, 368 mortos e 45 sobreviventes, também sem erros/timeouts. Foram reutilizados 253 resultados e reexecutados 160 mutantes.
- Nova revisão independente do diff terminou sem achados materiais. Nenhuma funcionalidade obrigatória ausente foi identificada. Publicação continua dependente de remote Git real e ativação do Pages.
