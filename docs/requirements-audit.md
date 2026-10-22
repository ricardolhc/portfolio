# Conferência do briefing original — 22 de outubro de 2026

Registro histórico anterior à solicitação de simplificação do contato e ampliação das tecnologias. O formulário descrito abaixo foi substituído por contato direto; a certificação passou a ter link específico fornecido pelo proprietário. Consulte [a atualização posterior](updates-2026-10-22.md) para o escopo atual e [verification.md](verification.md) para os resultados mais recentes.

A revisão confrontou os requisitos originais com o código, os testes e a configuração de publicação. Não foi encontrada uma seção ou funcionalidade obrigatória ausente.

| Grupo de requisitos                  | Implementação conferida                                                                                                                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Perfil e conteúdo profissional       | Hero, sobre, CLT separada de trabalho independente, duração explicitamente restrita ao vínculo formal e referência ao briefing de outubro de 2026.                                           |
| Projetos empresariais                | Dois projetos, contexto real de empresas, evolução do primeiro para o segundo, impactos de 98% e aproximadamente 80%, sem empresas, tecnologias específicas ou links inventados.             |
| Tecnologias, formação e certificação | Grupos completos de competências, graduação concluída, mestrado em andamento na Unipampa e AWS Certified Cloud Practitioner, Foundational, sem dados de credencial presumidos.               |
| Design e acessibilidade              | Página única, monocromática, responsiva, navegação por âncoras, menu mobile, foco e labels, redução de movimento e fonte Geist local.                                                        |
| Temas                                | Preferência persistida ou sistema na primeira visita; alternância manual e persistência. A meta `theme-color` acompanha o tema inicial e as trocas.                                          |
| Internacionalização                  | PT-BR/EN centralizados, detecção do navegador, fallback PT, persistência, `lang`, controles, validações e metadados atualizados.                                                             |
| Contato                              | Quatro campos validados, `mailto:` codificado, aviso para concluir envio no cliente, cópia de endereço/mensagem e texto selecionável. Falhas de preparação, abertura e cópia têm tratamento. |
| Privacidade e currículo              | Nenhum backend de contato, serviço externo de formulário, currículo fictício, screenshot fictícia, depoimento, cliente ou contrato inventado.                                                |
| Stack e scripts                      | React, Vite, TypeScript estrito, Tailwind, Motion, Vitest/RTL/userEvent/jsdom, Stryker/Vitest, ESLint e Prettier. Todos os comandos solicitados têm implementação real.                      |
| Arquitetura                          | Registry tipado e isolado, singleton/factory, erros de ausência/duplicidade/ciclo, inject/useInject, Context, composition root, contratos e adapters substituíveis.                          |
| Testes                               | Unitários e componentes separados, fakes, renderWithProviders, cobertura e mutação. Testes de navegador verificam seis larguras, dois temas e dois idiomas.                                  |
| SEO e performance                    | Metadados, Open Graph, favicon, Person, robots e preload. Canonical e sitemap são emitidos quando a URL real é fornecida; limitações da SPA multilíngue estão documentadas.                  |
| CI e publicação                      | Workflows de CI e Pages, mutação opcional em job separado, base e URL provenientes da configuração real do GitHub Pages.                                                                     |
| Documentação                         | README com instalação, comandos, arquitetura, DI/substituição, conteúdo, traduções, contato, testes, score e deploy; resultados reais em verification.md.                                    |

## Ajustes encontrados e corrigidos nesta conferência

1. A cor da interface do navegador ficava clara ao selecionar tema escuro. Agora acompanha a preferência inicial e as trocas; a verificação foi adicionada aos testes de componente e às 24 combinações no Chrome.
2. Uma falha do serviço que prepara a mensagem podia escapar do tratamento de erro e interromper o formulário. O fluxo passou a preservar os dados, exibir erro traduzido e manter a cópia do endereço disponível, incluindo falha após troca de idioma.
3. O teste de dependências circulares ganhou um limite de recursão no próprio fixture. Assim, remover a proteção de ciclos produz uma falha de asserção sem depender de timeout.
4. A tradução inglesa do processo financeiro foi corrigida de `receivables` para `payables`, mantendo a perspectiva de pagamentos vinculados a notas fiscais de entrada informada no briefing.

Foram escritos testes de regressão e observadas falhas antes das correções. A análise completa de mutação e as medições atuais estão em [verification.md](verification.md).

## O que ainda depende de configuração ou ambiente externo

- Configurar um remote Git real, enviar o código e habilitar GitHub Pages para executar os workflows e publicar. O checkout continua sem remote; não foi presumida uma URL de produção.
- Confirmar a hospedagem e a indexação depois do primeiro deploy.
- Uma auditoria manual com leitores de tela e dispositivos físicos pode ampliar a validação de acessibilidade. Não é uma funcionalidade de código ausente.

O formulário continuará dependendo do cliente de e-mail do visitante ou de cópia manual, conforme o requisito de não usar backend. O envio real não pode ser confirmado pela SPA.
