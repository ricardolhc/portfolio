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
