# Verificação da entrega

Última verificação em 22 de outubro de 2026, após a integração Formspree. Windows, Node 24.20.0 e npm 11.19.1. Branch `feat/portfolio`. O histórico também registra as execuções anteriores. Nenhum aplicativo real de e-mail foi aberto e nenhuma mensagem foi enviada. Alterações e arquivos atuais estão em [formspree-2026-10-22.md](formspree-2026-10-22.md).

## Resultados executados

| Verificação                    | Resultado                                                                   |
| ------------------------------ | --------------------------------------------------------------------------- |
| `npm run lint`                 | Passou, sem warnings                                                        |
| `npm run typecheck`            | Passou                                                                      |
| `npm run format:check`         | Passou                                                                      |
| `npm run test:unit`            | 80 testes passaram em 5 arquivos                                            |
| `npm run test:component`       | 22 testes passaram em 4 arquivos                                            |
| `npm run test:integration`     | 9 testes passaram em 1 arquivo, grafo/gateway reais com HTTP simulado       |
| Suíte Vitest pela cobertura    | 111 testes passaram em 10 arquivos                                          |
| `npm run test:coverage`        | 100% linhas, 99,24% branches, 100% funções, 100% statements                 |
| `npm run build`                | Passou                                                                      |
| `npm run test:mutation`        | 88,54%, acima da meta de 85%; sem erros, timeouts ou mutantes sem cobertura |
| `npm run test:e2e`             | 13 testes passaram; 24 combinações e fluxos de formulário/mobile/animação   |
| Lighthouse (anterior)          | 99/100/100/100 no refinamento; não reexecutado após o formulário            |
| Layout shift (anterior)        | CLS 0; LCP 1,8s no refinamento, sem nova medição nesta alteração            |
| Auditoria npm (anterior)       | Zero vulnerabilidades; dependências não foram alteradas nesta atualização   |
| Build de subcaminho (anterior) | Prefixos de assets e SEO validados; configuração de Pages preservada        |

As medições anteriores de Lighthouse foram feitas no preview do build, em `http://127.0.0.1:4173/`. Não são medições de uma implantação pública nem resultados do formulário atual. Relatórios completos são gerados localmente e ignorados pelo Git: `coverage/index.html`, `reports/mutation/mutation.html`, `playwright-report/index.html`, `reports/formspree/*.png` e capturas históricas em `reports/responsive/`.

## Responsividade e acessibilidade

Playwright executou o aplicativo real no Chrome instalado, com movimento reduzido, nas larguras 320, 375, 430, 768, 1024 e 1440px. Cada largura foi verificada em PT/EN e claro/escuro. As 24 combinações não apresentaram overflow horizontal nem violações nas regras axe WCAG 2 A/AA, 2.1 AA e 2.2 AA executadas.

As posições reais dos seis grupos confirmaram duas colunas/três linhas a partir de 768px e uma coluna abaixo disso. Os itens de tecnologias têm borda zero; números/rótulos e demais textos complementares verificados têm fonte mínima de 12px. O fluxo mobile confirma que o título de tecnologias fica abaixo do header fixo. O teste de movimento normal aguarda a aparição efetiva do conteúdo de projetos, tecnologias e formação. Os 13 E2E da rodada final passaram em 42,2s.

O fluxo mobile também verificou abertura do menu, fechamento com Escape e foco no botão, navegação por âncoras de projetos/certificação/contato, alternância de tema/idioma e persistência após recarga. O formulário foi preenchido e validado, com payload e cabeçalhos conferidos, estado pendente, prevenção de envio duplicado, confirmação simulada e limpeza. Cenários adicionais simularam HTTP 422/429, JSON inválido e falha de rede, preservando o conteúdo e permitindo recuperação em inglês. Todas as requisições Formspree foram interceptadas; nenhuma chegou ao serviço real.

As 24 combinações também verificam a geometria dos campos: nome/e-mail lado a lado em >=640px e empilhados no mobile, com assunto em largura total. Cópia real pela Clipboard API do Chrome e fallback indisponível em 320px passaram. Não houve erros JavaScript de página; somente erros esperados de recursos Formspree nos cenários deliberados de falha são filtrados no console. Os dois cards de experiência mantêm a barra superior nos dois temas. Capturas reais do contato em 375px/1440px, PT/EN e claro/escuro foram geradas; versões desktop clara e mobile escura foram inspecionadas, além da captura mobile clara inicial.

A primeira auditoria Lighthouse apontou CLS 0,114 devido à fonte e duas divergências entre texto visível e nome acessível. O preload local de Geist eliminou o deslocamento na medição seguinte. Os nomes acessíveis do logo e do seletor de idioma agora incluem o texto visível; o audit `label-content-name-mismatch` passou. Inputs mobile usam 16px para evitar zoom de foco no Safari; esse comportamento específico do Safari não foi medido em dispositivo físico.

Testes automatizados não equivalem a certificação WCAG completa. Não foram realizados testes manuais com leitores de tela, dispositivos físicos, Safari ou Firefox.

## Mutação e fortalecimento dos testes

### Integração Formspree

O escopo passou a incluir validação/normalização, configuração pública do endpoint, gateway HTTP e comportamento do novo formulário. Serviço e testes exclusivos do `mailto:` foram removidos. Thresholds preservados: `high: 85`, `low: 70`, `break: 75`. Nenhuma exclusão foi adicionada para elevar a pontuação.

A execução completa inicial avaliou **438 mutantes** em 8 minutos e 28 segundos: **86,30%**, com **378 `Killed` e 60 `Survived`**, zero `Timeout`, `RuntimeError` e `NoCoverage`. A análise revelou lacunas reais nas descrições acessíveis dos campos, resumo de validação, autocomplete do assunto, mensagem multilinha e prevenção do submit nativo. Os testes foram fortalecidos para essas regras.

A conferência do contrato do SDK oficial também levou à aceitação de confirmação por `next` textual, sem redirecionamento e sem aceitar `ok` explicitamente falso. Após essa alteração, a execução incremental avaliou **445 mutantes** em 5 minutos e 3 segundos: **88,31%**, com **393 `Killed` e 52 `Survived`**, também sem timeouts, erros ou mutantes sem cobertura. Foram reutilizados 195 resultados e reexecutados 250; o dry run executou 103 testes relevantes ao escopo.

Os sobreviventes foram inspecionados: 5 nomes descritivos de tokens, 18 alterações de ícones/classes dos controles, 6 alterações visuais/referência do header, 20 no formulário (12 classes de distribuição, 2 optional chaining de referências presentes no evento, 2 estados vazios equivalentes visualmente, tipo `text` implícito, tabulação do honeypot já oculto e 2 alterações do indicador visual), 1 texto interno de erro e 1 remoção de catch equivalente porque o resultado indefinido cai na validação seguinte. O último sobrevivente de `ContactActions` revelou ausência de asserção sobre feedback inicial vazio; a asserção foi acrescentada. Classes/ícones e geometria são verificados no navegador; o runner de mutação usa jsdom, sem layout. Não foram escritos testes para congelar detalhes meramente internos.

A confirmação incremental final concluiu em 1 minuto e 12 segundos: **88,54%**, **394 `Killed` e 51 `Survived` em 445 mutantes**, zero `Timeout`, `RuntimeError` e `NoCoverage`. Reutilizou 432 resultados e reexecutou 13. O sobrevivente de feedback inicial passou a `Killed`; `ContactActions` voltou a 100% de detecção. Os 51 restantes são os casos visuais/equivalentes e nomes internos discriminados acima. O código de produção não mudou entre as duas rodadas incrementais.

A cobertura do código atual é **213/213 linhas**, **83/83 funções**, **237/237 statements** e **132/133 branches**. A única branch ausente no jsdom é movimento reduzido em `Section.tsx`, exercitado no navegador. Build de produção: JS 343,88 kB, 111,54 kB gzip; CSS 19,52 kB, 5,26 kB gzip. A presença do endpoint exato no bundle foi conferida; há uma única definição em `src/`.

### Histórico: refinamento visual e profissional

A execução completa do refinamento avaliou **228 mutantes** em 3 minutos e 9 segundos: **87,72%**, com **200 `Killed` e 28 `Survived`**, zero `Timeout`, `RuntimeError` e `NoCoverage`. O escopo e os thresholds 85/70/75 foram mantidos, sem exclusões adicionais. Os novos testes de dados estáticos verificam PT/EN, mas não acrescentam mutantes de regras executáveis; a suíte total tem 54 testes e o dry run de mutação selecionou os 46 relevantes ao escopo executável.

Após acrescentar a nota acadêmica secundária dos projetos e finalizar os testes visuais, a confirmação incremental manteve **87,72%** em 18 segundos. Todos os 228 resultados foram reaproveitados porque nenhum arquivo mutado ou teste relevante à mutação mudou; o dry run do runner passou. O novo caso estático foi executado na suíte unitária e na cobertura completa, ambas verdes. Não foi alegada uma segunda avaliação completa dos mutantes.

Os sobreviventes foram reinspecionados e mantêm a distribuição anterior: 4 nomes descritivos de tokens, 18 alterações visuais nos controles e 6 no header (ícone/classes e optional chaining de referência presente durante o evento). Registry/inject/provider, serviços de aplicação, endereço/link de e-mail, infraestrutura, preferências e contato direto mantiveram 100% de detecção. Geometria, tipografia e contraste são verificados no navegador, pois jsdom não calcula layout.

### Histórico: atualização de conteúdo e contato direto

O novo escopo remove validadores e serviços exclusivos do formulário e inclui `ContactActions`. Não foram excluídas regras importantes. A execução completa avaliou **228 mutantes** em 3 minutos e 33 segundos: **87,28%**, com **199 `Killed` e 29 `Survived`**; zero `Timeout`, `RuntimeError` e `NoCoverage`. Os thresholds permanecem `high: 85`, `low: 70`, `break: 75`.

Os sobreviventes foram inspecionados: 4 nomes descritivos de tokens, 18 alterações visuais nos controles, 6 no header (classes/ícone e optional chaining de referência presente durante o evento) e 1 que removia o nome acessível do link com o endereço. A última lacuna motivou asserções de nome e descrição acessíveis no contato, sem mudar o código de produção. Aspectos de layout são verificados no Chrome, enquanto a mutação roda em jsdom.

A confirmação incremental concluiu em **87,72%**: **200 `Killed` e 28 `Survived`**, zero timeouts, erros ou mutantes sem cobertura, em 1 minuto e 54 segundos. Foram reaproveitados 149 resultados e reexecutados 79 mutantes; somente dois arquivos de teste mudaram. O mutante 114 (remoção do nome acessível) passou a `Killed`, e `ContactActions` atingiu 100% de detecção. Os 28 sobreviventes restantes são os 4 nomes de tokens, 18 alterações visuais dos controles e 6 alterações de header descritos acima. O cálculo final é `200 / 228`.

A cobertura daquela atualização era de **144/144 linhas**, **67/67 funções**, **156/156 statements** e **66/67 branches**. A única branch não coberta no jsdom era a preferência de movimento reduzido em `Section.tsx`; os testes E2E rodam com movimento reduzido. Não há testes de formulário antigo mantidos artificialmente para preservar contagens.

### Histórico anterior ao contato direto: conferência de 22 de outubro

A nova execução completa, após corrigir o contato e sincronizar `theme-color`, avaliou **413 mutantes** em 5 minutos e 12 segundos: **88,38%**, com 365 `Killed` e 48 `Survived`. Não houve `Timeout`, `RuntimeError` ou `NoCoverage`.

A análise dos novos sobreviventes motivou asserções para preservar a prévia ao copiar o endereço e recuperar o formulário após uma falha transitória de preparação. A confirmação incremental terminou em **89,10%**, em 2 minutos e 29 segundos: **368 `Killed`, 45 `Survived`**, zero timeouts, erros ou mutantes sem cobertura. Foram reaproveitados 253 resultados e reexecutados 160 mutantes; nenhum arquivo de produção mutado mudou entre essas duas execuções. O cálculo final é `368 / 413`.

Registry/inject/provider, serviços de aplicação, validação, detecção de idioma, infraestrutura e provider de preferências tiveram 100% de detecção. Os 45 sobreviventes daquela execução mantêm a distribuição descrita abaixo: 7 nomes descritivos de tokens, 14 no formulário, 18 nos controles e 6 no header. Não foi adicionada nenhuma exclusão para aumentar o resultado. Os problemas anteriores de timeout e serialização do runner não ocorreram nesta conferência.

### Histórico das primeiras execuções

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

O resultado anterior das 386 mutações foi: 338 `Killed`, 2 `Timeout`, 45 `Survived`, zero `NoCoverage` e 1 `RuntimeError`. O Stryker calculou 340 detectadas entre 385 avaliáveis: `(338 + 2) / (386 - 1)`. O erro de runner não foi contado como detecção. Registry/inject/provider, serviços, validação, detecção de idioma, infraestrutura e provider de preferências atingiram 100% de detecção; os nomes descritivos de tokens têm resultado separado.

Os sobreviventes foram inspecionados no JSON, inclusive na conferência adicional:

- **7 nomes descritivos de tokens:** remover o nome mantém a identidade por `Symbol`, embora reduza a qualidade de diagnóstico. Não foram criadas asserções que apenas congelam esses textos.
- **14 no formulário:** 12 afetam classes que distribuem os campos na grade; 2 removem optional chaining de referências presentes durante os eventos. A lacuna de associação do textarea ao erro foi resolvida pelos testes. A grade e a usabilidade foram verificadas no navegador; o runner de mutação usa jsdom, sem layout real.
- **18 nos controles:** alterações da seleção visual de idioma e dos ícones de tema. Persistência, conteúdo traduzido, tema aplicado e nomes acessíveis estão testados. A identidade exata do desenho e as classes não são congeladas em testes de implementação.
- **6 no header:** 5 afetam ícone e classes de visibilidade; 1 remove optional chaining de uma referência presente durante o evento. O comportamento visual e a navegação do menu foram testados no Chrome; esses testes não são executados pelo runner Vitest do Stryker.

Os dois timeouts anteriores removiam a proteção de ciclos do registry, produzindo resolução recursiva. Na conferência adicional, o fixture ganhou um limite de chamadas para detectar isso por asserção. O `RuntimeError` anterior era o mutante 228, que removia o retorno ao tentar copiar um formulário inválido. O runner falhava ao serializar o erro assíncrono desse mutante (`Cannot convert object to primitive value`, em `@stryker-mutator/util` / `vitest-runner`). A revisão adicional ampliou a proteção de preparação, prévia e cópia para impedir exceções não tratadas; a regra não foi excluída da mutação.

Os relatórios HTML e JSON estão em `reports/mutation/`. O relatório inicial foi preservado localmente em `reports/mutation-initial.json`. Alterações de nomes de tokens e aspectos visuais também participam da pontuação; nenhuma exclusão foi adicionada para ocultá-las.

## Revisão independente

Uma revisão independente da integração Formspree comparou o diff com `92f3c5c` e não encontrou achados materiais. Conferiu o gateway, confirmação, timeout, validação, honeypot, prevenção de concorrência, acessibilidade, traduções, layout e testes. A documentação apontada como pendente foi atualizada pelo agente principal. O revisor também executou typecheck com sucesso.

Uma nova revisão independente do refinamento comparou o diff com `0421f8d` e não encontrou problemas materiais ou requisitos faltantes. Conferiu textos, grupos/ordem, link CertMetrics, ausência de duração pública, CSS responsivo e preservação dos recursos existentes. Os comandos de validação e a inspeção visual foram executados pelo agente principal.

Na atualização de conteúdo e contato direto, uma nova revisão do diff verificou os requisitos atuais, os contratos e as suítes. Não encontrou problemas materiais de código ou testes. O README apontado como desatualizado durante a revisão foi ajustado para explicar a nova DI e o contato direto. Nenhuma certificação Azure foi adicionada; os indicadores e relatórios dos projetos são dados fornecidos na solicitação atual.

As observações a seguir registram as revisões anteriores ao contato direto.

Uma revisão independente do código foi solicitada pela skill de revisão. Duas observações sobre dados profissionais foram retiradas pelo revisor ao confrontar o briefing original: o nome exato **AWS Certified Cloud Practitioner**, a presença nacional do empregador, as atividades corporativas e os semestres dos projetos foram fornecidos explicitamente pelo usuário. Mantê-los preserva o requisito; removê-los reduziria a fidelidade ao briefing. A revisão terminou sem achados materiais. Não foi realizada confirmação documental externa dessas informações.

A melhoria visual de `theme-color` identificada na primeira revisão foi implementada em 22 de outubro: tanto o bootstrap quanto a alternância manual atualizam a cor sugerida à interface do navegador. Testes de componente e as 24 combinações de navegador verificam essa sincronização. A conferência adicional também corrigiu falhas de preparação do contato, com regressões reproduzidas antes das correções. O mapeamento integral está em [requirements-audit.md](requirements-audit.md).

A revisão independente das alterações adicionais também terminou sem achados materiais. O revisor conferiu recuperação do contato, preservação da prévia e sincronização de `theme-color`.

## Publicação e limites da verificação

- Os workflows de CI e Pages foram revisados e suas tags de ações confirmadas nos repositórios oficiais.
- Um build separado com domínio reservado `.invalid` e prefixo `/qa-fixture/` validou geração de assets e SEO. A fixture ficou somente em `reports/pages-fixture/`, não em `dist/` ou nos metadados de produção.
- O build local, sem `VITE_SITE_URL`, não emite canonical ou URLs inventadas. O workflow Pages usa a URL e o caminho retornados pela configuração real do GitHub.
- Não existe remote Git configurado. Não foram executados GitHub Actions remotamente, publicação no Pages ou verificação da hospedagem pública.
- Não houve verificação documental da credencial AWS nem acesso a sistemas de clientes. Links fornecidos pelo proprietário foram preservados.
- O formulário atual depende do Formspree; não houve envio real nem confirmação de entrega no e-mail de destino. As respostas HTTP foram simuladas, sem abrir aplicativos externos. Cópia e fallback foram verificados no navegador. Configurações antispam e restrições da conta Formspree não foram alteradas ou confirmadas.
