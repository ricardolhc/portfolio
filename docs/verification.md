# Verificação da entrega

Execução local em 21 de outubro de 2026, Windows, Node 24.20.0 e npm 11.19.1. Branch `feat/portfolio`. Nenhum aplicativo real de e-mail foi aberto e nenhuma mensagem foi enviada.

## Resultados executados

| Verificação                     | Resultado                                                                  |
| ------------------------------- | -------------------------------------------------------------------------- |
| `npm run lint`                  | Passou, sem warnings                                                       |
| `npm run typecheck`             | Passou                                                                     |
| `npm run format:check`          | Passou                                                                     |
| `npm run test:unit`             | 51 testes passaram em 4 arquivos                                           |
| `npm run test:component`        | 17 testes passaram em 3 arquivos                                           |
| `npm test`                      | 68 testes passaram                                                         |
| `npm run test:coverage`         | 100% linhas, 99,14% branches, 100% funções, 100% statements                |
| `npm run build`                 | Passou                                                                     |
| `npm run test:mutation`         | 88,31%, acima de `high: 85` e `break: 75`                                  |
| `npm run test:e2e`              | 7 testes passaram; 24 combinações de largura/tema/idioma e fluxo mobile    |
| Lighthouse 13.5.0, mobile local | Performance 99, acessibilidade 100, boas práticas 100, SEO 100             |
| Layout shift no Lighthouse      | CLS 0; LCP de laboratório 1,8s                                             |
| Auditoria npm                   | Zero vulnerabilidades após atualização transitiva                          |
| Build de subcaminho             | Assets, favicon, preload de fonte, canonical e sitemap com prefixo correto |

As medições de Lighthouse foram feitas no preview do build, em `http://127.0.0.1:4173/`. Não são medições de uma implantação pública. Relatórios completos são gerados localmente e ignorados pelo Git: `coverage/index.html`, `reports/lighthouse.report.html`, `reports/lighthouse.report.json`, `playwright-report/index.html`, `reports/responsive/*.png`.

## Responsividade e acessibilidade

Playwright executou o aplicativo real no Chrome instalado, com movimento reduzido, nas larguras 320, 375, 430, 768, 1024 e 1440px. Cada largura foi verificada em PT/EN e claro/escuro. As 24 combinações não apresentaram overflow horizontal nem violações nas regras axe WCAG 2 A/AA, 2.1 AA e 2.2 AA executadas.

O fluxo mobile também verificou abertura do menu, fechamento com Escape e foco no botão, navegação por âncora, alternância de tema/idioma, persistência após recarga, validação/foco de formulário e preparação do texto copiável. Capturas reais das seis larguras foram inspecionadas.

A primeira auditoria Lighthouse apontou CLS 0,114 devido à fonte e duas divergências entre texto visível e nome acessível. O preload local de Geist eliminou o deslocamento na medição seguinte. Os nomes acessíveis do logo e do seletor de idioma agora incluem o texto visível; o audit `label-content-name-mismatch` passou. Inputs mobile usam 16px para evitar zoom de foco no Safari; esse comportamento específico do Safari não foi medido em dispositivo físico.

Testes automatizados não equivalem a certificação WCAG completa. Não foram realizados testes manuais com leitores de tela, dispositivos físicos, Safari ou Firefox.

## Mutação e fortalecimento dos testes

A primeira execução completa do Stryker 10, com Vitest runner 10 e Vitest 4.1.12, mediu **76,04%** em 385 mutações. O comando passou o `break: 75`, mas não atingiu a meta `high: 85`.

A análise dos sobreviventes revelou lacunas reais em:

- Normalização de espaços em assunto e e-mail.
- Prioridade de idioma persistido em relação a um navegador em outro idioma.
- Rejeição de texto inválido após um e-mail e aceitação de mensagens em múltiplas linhas.
- Tipos de inputs, autofill, limite de tamanho e descrições acessíveis do formulário.
- Prevenção de navegação nativa no submit e limpeza de feedback ao editar a mensagem.
- Metadados e locale Open Graph em ambos os idiomas.
- Manutenção do menu aberto ao digitar outras teclas e preservação do foco com menu fechado.

Os testes foram reforçados para esses comportamentos, sem remover regras importantes da configuração de mutação. A segunda execução completa terminou em **88,05%**, em 4 minutos e 53 segundos, com o mesmo escopo de produção e a correção do nome acessível do logo. A meta desejada de 85% foi atingida.

Após adicionar a asserção de descrição acessível do textarea, a confirmação incremental terminou em **88,31%**, em 2 minutos e 7 segundos. Nenhum arquivo de produção mudou: 266 resultados não afetados foram reaproveitados e 120 mutantes foram reexecutados. O mutante 255, que removia a associação da mensagem ao erro, passou de `Survived` para `Killed`.

O resultado final das 386 mutações é: 338 `Killed`, 2 `Timeout`, 45 `Survived`, zero `NoCoverage` e 1 `RuntimeError`. O Stryker calculou 340 detectadas entre 385 avaliáveis: `(338 + 2) / (386 - 1)`. O erro de runner não foi contado como detecção. Registry/inject/provider, serviços, validação, detecção de idioma, infraestrutura e provider de preferências atingiram 100% de detecção; os nomes descritivos de tokens têm resultado separado.

Os sobreviventes foram inspecionados no JSON:

- **7 nomes descritivos de tokens:** remover o nome mantém a identidade por `Symbol`, embora reduza a qualidade de diagnóstico. Não foram criadas asserções que apenas congelam esses textos.
- **14 no formulário:** 12 afetam classes que distribuem os campos na grade; 2 removem optional chaining de referências presentes durante os eventos. A lacuna de associação do textarea ao erro foi resolvida pelos testes. A grade e a usabilidade foram verificadas no navegador; o runner de mutação usa jsdom, sem layout real.
- **18 nos controles:** alterações da seleção visual de idioma e dos ícones de tema. Persistência, conteúdo traduzido, tema aplicado e nomes acessíveis estão testados. A identidade exata do desenho e as classes não são congeladas em testes de implementação.
- **6 no header:** 5 afetam ícone e classes de visibilidade; 1 remove optional chaining de uma referência presente durante o evento. O comportamento visual e a navegação do menu foram testados no Chrome; esses testes não são executados pelo runner Vitest do Stryker.

Os dois timeouts removem a proteção de ciclos do registry, produzindo resolução recursiva. São detectados por tempo, não por uma asserção concluída. O único `RuntimeError` é o mutante 228, que remove o retorno ao tentar copiar um formulário inválido. O runner falhou duas vezes ao serializar o erro assíncrono desse mutante (`Cannot convert object to primitive value`, em `@stryker-mutator/util` / `vitest-runner`). O código original passou todos os testes; essa alteração específica não recebeu resultado avaliável. A incompatibilidade pontual da ferramenta está registrada, sem ocultar ou excluir a regra de produção.

Os relatórios HTML e JSON estão em `reports/mutation/`. O relatório inicial foi preservado localmente em `reports/mutation-initial.json`. Alterações de nomes de tokens e aspectos visuais também participam da pontuação; nenhuma exclusão foi adicionada para ocultá-las.

## Revisão independente

Uma revisão independente do código foi solicitada pela skill de revisão. Duas observações sobre dados profissionais foram retiradas pelo revisor ao confrontar o briefing original: o nome exato **AWS Certified Cloud Practitioner**, a presença nacional do empregador, as atividades corporativas e os semestres dos projetos foram fornecidos explicitamente pelo usuário. Mantê-los preserva o requisito; removê-los reduziria a fidelidade ao briefing. A revisão terminou sem achados materiais. Não foi realizada confirmação documental externa dessas informações.

Melhoria visual opcional identificada: o `theme-color` do navegador permanece com o valor claro; o tema de toda a página e seus controles alterna corretamente. Isso afeta somente a cor sugerida para a interface do navegador em clientes que usam essa meta tag.

## Publicação e limites da verificação

- Os workflows de CI e Pages foram revisados e suas tags de ações confirmadas nos repositórios oficiais.
- Um build separado com domínio reservado `.invalid` e prefixo `/qa-fixture/` validou geração de assets e SEO. A fixture ficou somente em `reports/pages-fixture/`, não em `dist/` ou nos metadados de produção.
- O build local, sem `VITE_SITE_URL`, não emite canonical ou URLs inventadas. O workflow Pages usa a URL e o caminho retornados pela configuração real do GitHub.
- Não existe remote Git configurado. Não foram executados GitHub Actions remotamente, publicação no Pages ou verificação da hospedagem pública.
- Não houve verificação documental da credencial AWS nem acesso a sistemas de clientes. Links fornecidos pelo proprietário foram preservados.
- A abertura real de cliente de e-mail depende do visitante e foi substituída por fakes nos testes. O fluxo de preparação/cópia foi verificado no navegador.
