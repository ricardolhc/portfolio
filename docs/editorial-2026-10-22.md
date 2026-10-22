# Refinamento de Projetos, Tecnologias e Certificação

Alteração incremental sobre `2ecfbb7`, limitada às três seções solicitadas. Não há novas dependências. Hero, Sobre, Experiência, Formação, Contato, header, footer, navegação, DI e preferências permanecem intactos.

## Implementação

- **Projetos:** identificador “03 / PROJETOS” / “03 / PROJECTS”; título principal preservado. Cada case possui conteúdo editorial e resultado em duas áreas a partir de 768px, empilhados abaixo disso. Descrições, contexto e solução seguem os textos concisos fornecidos pelo proprietário. Métricas aproximadas de 98% e 80%, tecnologias e continuidade independente permanecem corretas. Uma faixa inferior separa as tecnologias, apresentadas em tags neutras.
- **Tecnologias:** todas as categorias e tecnologias foram mantidas. Blocos com bordas sutis, ícone por categoria, título e tags compartilhadas com projetos. Duas colunas CSS com alturas naturais evitam esticar JavaFX e outras categorias curtas. A ordem de leitura no desktop é de cima para baixo em cada coluna; no mobile, uma coluna na ordem original do conteúdo. Hover apenas na borda, sem movimento ou cores novas.
- **Certificação:** card escuro em ambos os temas, com logotipo AWS em SVG local, proporções e cores originais preservadas. Pequena base branca garante contraste sem modificar a marca. Nome completo, Foundational, emissor e URL CertMetrics permanecem. Inglês utiliza “View Credential”.

As animações e o suporte a movimento reduzido foram preservados. Ícones decorativos são ocultos de tecnologias assistivas; tags são listas semânticas nomeadas. O logo possui texto alternativo nos dados bilíngues.

## SVG AWS

Arquivo da Amazon disponibilizado no [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Amazon_Web_Services_Logo.svg), incluído sem alterações gráficas. Documentação em `src/assets/README.md`. Licença e atribuição ficam em `public/licenses/` e são copiadas para o build. O import do Vite suporta subcaminhos do GitHub Pages e pode embutir o SVG como data URI. Não há hotlink, filtro de cor ou imagem gerada.

## Arquivos

- `src/presentation/components/PortfolioSections.tsx`: cases, tags compartilhadas, ícones das categorias e imagem AWS.
- `src/presentation/components/Icon.tsx`: sete ícones monocromáticos no mecanismo existente.
- `src/presentation/i18n/messages.ts`: somente dados de projetos e certificação alterados em PT/EN.
- `src/styles.css`: regras restritas às três seções e novas tags.
- `src/assets/aws-logo.svg`, `src/assets/README.md`, `public/licenses/aws-logo-Apache-2.0.txt`, `public/licenses/aws-logo-NOTICE.txt`: asset e atribuição.
- `.prettierignore`: preserva o SVG de terceiros em seu formato original.
- `tests/component/editorial-sections.test.tsx`: seis testes novos de cases, listas e credencial PT/EN.
- `tests/component/portfolio.test.tsx`, `tests/unit/professional-content.test.ts`, `tests/browser/portfolio.spec.ts`: textos, tradução, tags, geometria adaptativa e carregamento real do logo.
- `README.md`, `docs/verification.md`, `docs/implementation-ledger.md` e este documento.

## Verificação

A suíte Vitest passou com 118 testes. Os 13 E2E passaram em 36,6s, incluindo 24 combinações das larguras 320/375/430/768/1024/1440, PT/EN e claro/escuro, sem overflow ou violações axe nas regras executadas. Asserções verificam duas áreas dos cases no desktop, empilhamento mobile, faixa de tecnologias, duas colunas de cards com alturas independentes, tags com bordas e SVG realmente carregado. Fluxos existentes de navegação, preferências, contato e recuperação de falhas continuam passando; nenhum envio real foi realizado.

Capturas adicionais das três seções em 375px/1440px, PT/EN e claro/escuro ficam em `reports/editorial/`. Foram inspecionadas versões desktop clara de projetos/tecnologias e mobile escura da certificação. A revisão independente não encontrou achados materiais.

Cobertura: 100% linhas, funções e statements; 98,56% branches. As duas branches ausentes são movimento reduzido no jsdom (exercitado no navegador) e o fallback de ícone para categoria futura. Stryker e Lighthouse não foram reexecutados neste refinamento visual. O escopo/thresholds de mutação e suas regras de produção não foram alterados; o resultado de 88,54% permanece uma medição histórica da etapa anterior. Resultados completos em [verification.md](verification.md).
