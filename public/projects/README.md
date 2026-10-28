# Capturas de projetos

As imagens públicas são capturas reais das aplicações, realizadas em 27/10/2026, em 1440 × 960:

- `valorantguess.webp`: https://ricardolhc.github.io/ValorantGuess/ — rodada em andamento.
- `rumble-challenge.webp`: https://ricardolhc.github.io/rumble-challenge/ — tela de seleção de personagens.

As duas capturas públicas foram convertidas para WebP com qualidade 85, sem metadados, e mostram as interfaces reais das aplicações. Os dois repositórios correspondentes foram confirmados como públicos pela API do GitHub nessa data.

As capturas dos projetos empresariais fornecidas pelo proprietário também estão incluídas:

- `automacao_fiscal.png` (1952 × 806): consulta de notas da SEFAZ e geração de planilhas.
- `gestao_financeira.png` (1619 × 971): visão geral financeira com valores ocultos.

## Adicionar outras capturas

1. Receber somente arquivos autorizados, já censurados de forma irreversível. Conferir todos os pixels, inclusive títulos, tabelas e rodapés.
2. Exportar para WebP rasterizado, sem EXIF, XMP ou outros metadados. Nunca adicionar originais sensíveis, versões não censuradas, documentos ou backups ao repositório/public.
3. Colocar apenas as versões finais em `public/projects/`, preferencialmente com largura de até 1440 px e enquadramento consistente. Preservar a proporção e a anonimização.
4. Em `src/presentation/projects/catalog.ts`, preencher `images` do projeto `01` ou `02`: `src` relativo à pasta public, `width`, `height` e `alt` em pt-BR/en. Não cadastrar caminhos de arquivos inexistentes.
5. Com duas ou mais imagens, a navegação manual aparece automaticamente. Uma imagem oferece ampliação; lista vazia mantém apenas o conteúdo do projeto, sem reservar espaço.

As capturas exibem as aplicações em português nos dois idiomas do portfólio; textos alternativos, controles e conteúdo do portfólio são traduzidos.
