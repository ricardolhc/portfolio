# Projetos e certificação: composição aberta

Refinamento incremental sobre `ba3a51d`, restrito às duas seções solicitadas. Não houve alteração dos textos dos projetos, métricas, tecnologias, links, fontes globais, navegação, animações, preferências, DI ou contato. A seção Tecnologias também permaneceu intacta.

## Mudanças

- **Projetos:** resultado sem caixa fechada ou fundo próprio. No desktop, uma linha vertical discreta separa impacto de conteúdo; no mobile, uma linha superior acompanha o empilhamento. Métricas de 60–80px permanecem fortes, com rótulo e legenda próximos. Tecnologias ficam dentro da área de conteúdo, abaixo da solução, com tags mais compactas e altura uniforme. Os estilos de tags foram ajustados somente dentro de `.project-technologies`.
- **Certificação:** logo reduzido de 80 para 52px, sem base branca. O SVG usa a apresentação monocromática branca, mantendo os caminhos e proporções originais; a alteração de cor está registrada na atribuição. Cabeçalho reúne logo, organização e Foundational. Espaçamentos menores aproximam título, emissor e link. O badge recebe padding menor somente neste card; a partir de 375px permanece na mesma linha da identificação, e em 320px pode empilhar naturalmente.
- **PT/EN:** todos os textos e destinos foram preservados. O identificador “Amazon Web Services” foi centralizado no conteúdo bilíngue da certificação, mantendo o nome oficial.

A apresentação branca sobre fundo escuro está ilustrada no [guia visual AWS, página 43](https://pages.awscloud.com/rs/112-TZM-766/images/AWS%20Partner%20Creative%20and%20Messaging%20Guide_January_2022_v1.pdf). Não há filtros CSS, hotlink, fundo branco incorporado ou novas dependências.

## Arquivos

- `src/presentation/components/PortfolioSections.tsx`
- `src/styles.css`
- `src/presentation/i18n/messages.ts`
- `src/assets/aws-logo.svg` e `src/assets/README.md`
- `public/licenses/aws-logo-NOTICE.txt`
- `tests/component/editorial-sections.test.tsx`
- `tests/browser/portfolio.spec.ts`
- `README.md`, `docs/verification.md`, `docs/implementation-ledger.md` e este documento.

## Verificações

118 testes Vitest passaram, com 100% linhas/funções/statements e 98,56% branches. Os 13 E2E verificam as seis larguras 320/375/430/768/1024/1440, PT/EN e claro/escuro: ausência de moldura fechada, posição das tecnologias, altura uniforme das tags, transparência/tamanho do logo, alinhamento do cabeçalho, navegação, preferências e contato simulado. Lint, TypeScript e build passaram.

As novas consultas de organização observaram duas falhas antes da implementação. O teste adicional de alinhamento revelou quebra desnecessária do badge em 375px; gap e padding locais foram reduzidos, preservando o empilhamento em 320px. A revisão independente não encontrou achados materiais.

Capturas adicionais ficam em `reports/open-impact/`, ignoradas pelo Git. Foram inspecionados projetos no desktop e certificação no mobile, com conferência de claro/escuro e PT/EN. A comparação automatizada confirmou dados modificados somente em `certifications`; Hero, Sobre, Experiência, Tecnologias, Formação, Contato e o componente compartilhado de tags mantêm seu código.

Stryker e Lighthouse não foram reexecutados nesta alteração visual; escopo e thresholds permanecem intactos. Nenhum envio real ou publicação remota foi realizado. Resultados completos em [verification.md](verification.md).
