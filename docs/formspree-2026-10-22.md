# Integração Formspree — 22 de outubro de 2026

Alteração incremental sobre `92f3c5c`, preservando as outras seções, temas, idiomas, animações e arquitetura. Substitui a abordagem de contato direto descrita nos documentos históricos. Não adiciona dependências.

## Arquivos e decisões

- `src/domain/contracts.ts`: mensagem tipada com `name`, `email`, `subject` e `message`; contrato `ContactGateway.send(): Promise<void>`.
- `src/domain/contact.ts`: endereço alternativo, campos, limites, normalização, validação pura e erro de gateway com códigos seguros.
- `src/config/contact.ts`: único endpoint de produção, `https://formspree.io/f/moeeapay`.
- `src/infrastructure/formspree-contact-gateway.ts`: POST JSON, `Accept: application/json`, interpretação de resposta, timeout, erros e rate limiting. `fetch` pode ser substituído no construtor dos testes.
- `src/application/tokens.ts` e `src/composition-root.ts`: registro do gateway no registry existente.
- `ContactForm.tsx`: controla dados, validação, foco, honeypot e estados; resolve o contrato com `useInject`. Não conhece HTTP nem instancia o adapter.
- `ContactActions.tsx`: alternativa discreta de cópia, com status próprio e seleção manual se clipboard falhar.
- `PortfolioSections.tsx`, `messages.ts` e `styles.css`: encaixe do formulário, traduções e estilos monocromáticos responsivos.
- Removidos o serviço de composição `mailto:` e seu teste. Nenhum fluxo principal abre aplicativo externo.

O endpoint público é incluído diretamente no build pelo módulo de configuração. Portanto, o deploy existente no GitHub Pages não precisa de variável de ambiente, segredo ou servidor Node.js. Os workflows foram preservados.

## Comportamento e limites

Os quatro campos são obrigatórios; valores só com espaços são inválidos. A normalização remove espaços externos, preservando acentos e quebras de linha da mensagem. Limites: nome 100, e-mail 254, assunto 160 e mensagem 5.000 caracteres. Nome e assunto não permitem quebras de linha.

O envio é bloqueado por referência enquanto há uma requisição pendente, além dos controles desabilitados. Os campos somente são limpos após HTTP bem-sucedido e JSON com confirmação reconhecida: `ok: true` ou, na ausência de `ok`, `next` textual, conforme o [contrato do SDK oficial](https://github.com/formspree/formspree-js/blob/main/packages/formspree-core/src/submission.ts). O campo `next` nunca é usado para navegar. Respostas com `error`/`errors`, JSON inválido, falha de rede, timeout de 15 segundos ou HTTP sem sucesso são tratadas como falha. HTTP 429 tem feedback específico, traduzido, para aguardar antes de tentar novamente.

O honeypot oculto `_gotcha` bloqueia o envio local quando preenchido; a requisição legítima inclui esse campo vazio. A medida segue a [documentação de honeypot do Formspree](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering). Não há confirmação falsa para bots. Validação no navegador não impede todo spam; filtros, limites, restrições e configurações da conta Formspree não foram alterados nem verificados. Nenhum CAPTCHA foi adicionado.

## Interface e acessibilidade

A coluna esquerda mantém título, descrição e redes profissionais. Nome e e-mail ficam lado a lado a partir de 640px; assunto e mensagem ocupam toda a largura. No mobile, os campos ficam em uma coluna. O envio é o botão principal; o endereço e sua cópia ficam abaixo, em estilo secundário.

Labels são associados aos campos; mensagens de erro usam `aria-describedby` e `aria-invalid`. O foco vai ao primeiro erro. Há `aria-busy`, botão desabilitado e indicador discreto durante o envio. Regiões de status nomeadas distinguem envio de cópia. Labels, erros e estados mudam entre PT/EN sem perder os dados. A animação respeita movimento reduzido.

## Verificação

Testes unitários cobrem validação, limites, payload, cabeçalhos, timeout, confirmação e falhas de gateway. Componentes cobrem preenchimento, validação/foco, acessibilidade, envio concorrente, mensagem multilinha, sucesso, recuperação, honeypot e traduções. Integração cobre os providers e o gateway real com HTTP simulado, além da substituição do contrato por fake.

O setup do Vitest bloqueia `fetch` real por padrão. Playwright intercepta Formspree e simula sucesso, HTTP 422/429, resposta inválida e falha de rede. Verifica formulário, cópia, persistência, temas, idiomas e geometria nas seis larguras solicitadas, com auditoria axe. Nenhum teste envia e-mails reais.

Resultados executados, cobertura e análise de mutação estão em [verification.md](verification.md). Relatórios locais ignorados pelo Git: `coverage/`, `reports/mutation/`, `reports/formspree/` e `playwright-report/`.

Não foi realizado envio real nem confirmado recebimento no e-mail de destino. Não houve publicação no GitHub Pages; este checkout continua sem remote configurado. A disponibilidade e a entrega efetiva do serviço permanecem fora do que os testes simulados podem comprovar.
