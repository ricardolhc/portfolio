# Refinamento visual e profissional — 22 de outubro de 2026

Atualização incremental sobre `0421f8d`, sem recriar a aplicação ou acrescentar dependências. Foram preservados React/Vite/TypeScript, Tailwind, Motion, registry/inject, providers, temas, PT/EN, contato direto e workflows de publicação.

## Conteúdo profissional

- Card formal: **Desenvolvedor Full Stack** / **Full Stack Developer**, com React e TypeScript e experiência prática em Java e Node.js. Responsabilidades revisadas; último item: “Manutenção e evolução de sistemas.” Não foram atribuídos projetos específicos ou responsabilidades adicionais a Java/Node.js.
- Duração do vínculo removida dos dados de apresentação e da marcação, sem substituir por datas ou outra duração. O rótulo redundante de desenvolvimento independente também foi removido para manter a estrutura dos cards equilibrada. Categorias, descrições e responsabilidades continuam distinguindo as duas experiências.
- Sobre: abertura voltada a aplicações e automação, sem repetir o cargo; parágrafo profissional com as quatro tecnologias e processos fiscais/financeiros. Formação e “Engenharia na base. Resultados na prática.” preservados.
- Certificação: endereço CertMetrics exato fornecido pelo proprietário, com nova aba, `noopener noreferrer` e ícone externo. Nome, emissor, categoria e estrutura preservados; sem datas presumidas.
- Projetos: contexto inicial voltado a necessidades empresariais reais e evolução do controle financeiro. Layout de três áreas, soluções, indicadores/relatórios e métricas de 98% e aproximadamente 80% preservados. Uma nota secundária de continuidade informa que os projetos independentes foram desenvolvidos durante a graduação; os semestres deixaram de competir com o contexto empresarial.

## Tecnologias e práticas

Título e subtítulo atualizados nos dois idiomas. A ordem dos seis grupos é: front-end, back-end, bancos de dados, versionamento e CI/CD, cloud e testes/qualidade. Todas as ferramentas anteriores foram preservadas; AWS aparece antes de Azure. GitHub Pages permanece uma plataforma de deploy dentro do grupo de entrega, e não uma certificação ou ferramenta de automação.

A grade usa duas colunas a partir de 768px e uma abaixo desse limite. Os grupos têm número, título e linha superior. Tecnologias são texto de 16px, com espaçamento e quebra automática, sem retângulos individuais. Foram removidos o terceiro eixo de colunas e o span especial do último grupo; não há alturas mínimas artificiais.

## Espaçamento e legibilidade

`src/styles.css` centraliza os tokens de seção, projeto e texto secundário. O padding vertical de seção passou de 72/96/112px para **56/72/80px** em mobile/tablet/desktop. O padding dos projetos usa 32/36/40px, e o intervalo após os cabeçalhos foi reduzido para 28px. Isso melhora a continuidade entre projetos, tecnologias e formação sem eliminar separadores ou o respiro editorial.

Rótulos e números usam pelo menos 12px; textos complementares usam 14px e parágrafos de detalhes 15px com entrelinha confortável. As cores monocromáticas já contrastadas foram mantidas. O Hero conserva fonte, escala tipográfica, botões e adaptação ao tema.

## Arquivos modificados

| Arquivo                                             | Alteração                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `src/presentation/i18n/messages.ts`                 | Conteúdos PT/EN, seis grupos, cargo, projetos e remoção da duração |
| `src/presentation/components/PortfolioSections.tsx` | Link CertMetrics e remoção da linha de duração                     |
| `src/styles.css`                                    | Grade textual, tokens, espaçamentos e legibilidade                 |
| `tests/unit/professional-content.test.ts`           | Oito casos de dados profissionais PT/EN                            |
| `tests/component/portfolio.test.tsx`                | Cargo, ausência de duração, categorias e certificação              |
| `tests/integration/app.test.tsx`                    | Conteúdo traduzido através dos providers e composition root reais  |
| `tests/browser/portfolio.spec.ts`                   | Geometria da grade, tipografia, bordas, certificação e animações   |
| `README.md`                                         | Descrição profissional e documentação dos padrões visuais atuais   |
| `docs/verification.md`                              | Resultados atuais e análise de mutação                             |
| `docs/implementation-ledger.md`                     | Registro de execução e revisão                                     |
| `docs/updates-2026-10-22.md`                        | Indicação de que a atualização anterior é histórica                |
| Este documento                                      | Mapeamento do refinamento                                          |

## Verificação

Os testes foram atualizados e observados falhando contra o estado anterior antes das alterações. A suíte Vitest atual tem **54 testes**: 36 unitários, 15 de componentes e 3 de integração. Os testes do contato existente foram preservados.

Playwright verifica 320, 375, 430, 768, 1024 e 1440px em PT/EN e claro/escuro, a geometria de duas colunas/três linhas ou uma coluna, textos sem bordas, tipografia mínima e ausência de overflow. Também cobre navegação, persistência, header sem cobrir o título de destino, cópia e fallback, além das transições com movimento normal. A abertura da certificação usa uma aba e resposta controladas pelo teste, sem acessar o verificador real; e-mail não abre aplicativo externo.

Capturas completas e de viewport foram inspecionadas, assim como os recortes de tecnologias em ambos os temas/idiomas. Nos recortes altos de uma seção, o teste oculta temporariamente header e skip link fixos apenas durante a captura, pois esses overlays podem atravessar a imagem composta. A captura de viewport e os testes de navegação mantêm os controles reais visíveis.

O Stryker mantém exatamente o escopo e thresholds anteriores: 85/70/75. Nenhuma exclusão foi acrescentada. A revisão independente não encontrou problemas materiais. Resultados executados completos estão em [verification.md](verification.md).

Nenhuma publicação ou execução remota de Actions foi realizada; o checkout continua sem remote. Não houve auditoria manual com leitores de tela ou dispositivos físicos.
