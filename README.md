# Ricardo Costa · Portfólio Full Stack

Portfólio profissional de página única com React, Vite e TypeScript estrito. Apresenta atuação como Desenvolvedor Trainee e estágio Full Stack na Compass UOL, desenvolvimento independente de soluções empresariais, formação em Engenharia de Software e certificação AWS.

A identidade visual é editorial e monocromática, com fonte Geist hospedada no próprio build. Não há analytics, backend próprio, fontes remotas ou dados de clientes. O contato utiliza o Formspree somente quando o visitante envia o formulário.

## Funcionalidades

- Seções de apresentação, sobre, experiência, projetos, tecnologias, formação, certificação e contato.
- Português brasileiro e inglês completos; alternância persistente e `lang` atualizado.
- Tema claro/escuro com preferência inicial do sistema e escolha manual persistente.
- Navegação por âncoras, menu mobile com Escape, foco visível e link para pular navegação.
- Transições discretas com Motion e respeito a `prefers-reduced-motion`.
- Formulário de contato integrado ao Formspree, validação PT/EN, estados acessíveis e cópia alternativa do e-mail.
- Projetos em cases com duas áreas: conteúdo com tags discretas e resultado tipográfico aberto, sem caixa ao redor das métricas.
- Nove categorias de tecnologias, incluindo IA aplicada ao desenvolvimento, com ícones monocromáticos, cards de altura natural e tags neutras, em duas colunas no desktop e uma no mobile. Programação concorrente aparece separadamente como prática técnica.
- Acesso direto à certificação AWS pelo link fornecido pelo proprietário.
- Registry tipado, singleton/factory, detecção de ciclos, Context e serviços substituíveis nos testes.
- CI, cobertura, testes de mutação e deploy GitHub Pages.

A experiência corporativa e os projetos independentes são apresentados separadamente. Na Compass UOL, trainee desde maio de 2025 e estágio de julho a dezembro de 2024 têm responsabilidades e tecnologias próprias; Java, JavaFX e Spring Boot aparecem nos projetos independentes correspondentes. Os períodos e dados acadêmicos foram fornecidos pelo proprietário. Não foram inventados contratos, clientes, URLs de demonstração, depoimentos ou dados de credenciais. A graduação inclui Láurea Acadêmica e média 9,13/10; o mestrado profissional está em andamento e o IFAM complementa a formação técnica.

## Requisitos e instalação

Node.js **22.12+**, recomendado **24 LTS**, e npm. A instalação é reproduzível pelo `package-lock.json`.

```sh
npm ci
npm run dev
```

Abra a URL local impressa pelo Vite, normalmente `http://127.0.0.1:5173/`.

## Comandos

| Comando                    | Finalidade                                   |
| -------------------------- | -------------------------------------------- |
| `npm run dev`              | Servidor de desenvolvimento                  |
| `npm run build`            | TypeScript e build de produção em `dist/`    |
| `npm run preview`          | Servir o build localmente                    |
| `npm run lint`             | ESLint sem warnings permitidos               |
| `npm run typecheck`        | Verificar todos os arquivos TypeScript       |
| `npm run format`           | Formatar com Prettier                        |
| `npm run format:check`     | Verificar formatação                         |
| `npm test`                 | Todos os testes Vitest, sem modo watch       |
| `npm run test:unit`        | Registry, preferências, validação e gateways |
| `npm run test:component`   | Interações de componentes e providers        |
| `npm run test:integration` | Composition root, providers e adapters reais |
| `npm run test:coverage`    | Cobertura V8, terminal e HTML                |
| `npm run test:mutation`    | Stryker, terminal, HTML e JSON               |
| `npm run test:e2e`         | Chrome/Playwright, responsividade e axe      |

Testes no navegador usam o build: execute `npm run build` primeiro. Localmente, o Playwright usa o Chrome instalado. Em CI (`CI=true`), usa Chromium; instale-o com `npx playwright install --with-deps chromium`. O servidor de preview é iniciado pelo Playwright quando necessário.

### Logs locais

Guarde saídas de comandos em `reports/logs/`, mantendo a raiz livre de arquivos de execução. A pasta de relatórios e arquivos `*.log` são ignorados pelo Git. Os logs históricos da raiz foram movidos para essa pasta, preservando os nomes e conteúdos.

No PowerShell, redirecione novas execuções assim:

```powershell
New-Item -ItemType Directory -Path reports/logs -Force | Out-Null
npm run build *> reports/logs/build.log
npm run test:coverage *> reports/logs/coverage.log
```

## Organização e arquitetura

```text
src/
  core/di/                  # Registry, tokens, inject, useInject, Context
  domain/                   # Contratos, mensagem e validação de contato
  config/                   # Endpoint público do Formspree
  application/              # Preferências, detecção de idioma e tokens
  infrastructure/           # Formspree, browser/storage/clipboard
  presentation/
    components/             # Header, formulário e seções semânticas
    preferences/            # Estado React, tema, idioma e metadados
    i18n/messages.ts        # Conteúdo e traduções PT/EN
    App.tsx
  composition-root.ts       # Registro das implementações reais
  main.tsx                  # Bootstrap React
  styles.css                # Tailwind, tokens e estilos responsivos
tests/
  unit/                     # Funções, serviços e adapters
  component/                # React Testing Library + userEvent
  integration/              # Grafo real, providers e adapters de navegador
  browser/                  # Playwright + axe, sem envio real de e-mail
  renderWithProviders.tsx   # Registry específico por teste
.github/workflows/          # CI e Pages
```

**Domain** contém `ContactMessage`, `ContactGateway` e validação pura. **Application** coordena preferências e declara tokens. **Infrastructure** implementa o gateway HTTP, persistência e clipboard. **Presentation** conhece contratos e tokens, sem instanciar infraestrutura nem chamar `fetch`. **Core** fornece a DI. O composition root registra `FormspreeContactGateway` antes da renderização; `ContactForm` o resolve com `useInject`.

Os conteúdos profissionais são dados estáticos bilíngues. Não há uma interface de repositório de dados artificial para esse caso.

### Registry e inject

Cada token tem uma identidade `Symbol` e um tipo. Nomes iguais não confundem dependências. Um registry não compartilha estado com outro. Singleton é o padrão; factory cria uma instância por resolução. Registros duplicados, tokens ausentes e ciclos produzem erros descritivos. Uma factory que falha pode ser resolvida novamente, sem envenenar o registry.

```tsx
import { Registry, createToken } from './src/core/di/registry';
import { inject, useInject } from './src/core/di/inject';
import { DependencyProvider } from './src/core/di/dependency-provider';

interface Clock {
  now(): number;
}
const clockToken = createToken<Clock>('clock');
const registry = new Registry().register(clockToken, () => ({
  now: () => Date.now(),
}));
const clock = inject(registry, clockToken); // API fora do React

function Time() {
  const clock = useInject(clockToken); // Somente no topo de um componente/hook
  return <span>{clock.now()}</span>;
}

// <DependencyProvider registry={registry}><Time /></DependencyProvider>
// Ciclo factory, quando instâncias independentes forem necessárias:
const independent = new Registry().register(
  clockToken,
  () => ({ now: () => Date.now() }),
  'factory',
);
```

### Substituir dependências em testes

Crie um registry novo, em vez de alterar singletons globais. Por exemplo, um formulário sem efeitos externos:

```tsx
import { Registry } from './src/core/di/registry';
import { TOKENS } from './src/application/tokens';
import { PreferenceService } from './src/application/preference-service';

const registry = new Registry()
  .register(TOKENS.contactGateway, () => ({ send: async () => {} }))
  .register(TOKENS.clipboard, () => ({
    write: async (text) => {
      console.log(text);
    },
  }))
  .register(
    TOKENS.preferences,
    () =>
      new PreferenceService(
        { get: () => null, set: () => {} },
        { language: 'pt-BR', prefersDark: () => false },
      ),
  );
// renderWithProviders(<ContactForm />, registry)
```

Para substituir somente um adapter e manter os serviços reais, monte um novo grafo a partir de `src/composition-root.ts`, registrando um fake no token do adapter **antes** dos consumidores. O registry rejeita sobrescritas acidentais; cada composição declara uma implementação por token.

## Editar conteúdo e traduções

Edite `src/presentation/i18n/messages.ts`. A versão inglesa é verificada contra o formato da portuguesa pelo TypeScript.

- Hero, experiência, formação, certificação e textos acessíveis ficam nesse arquivo.
- Para adicionar um projeto, acrescente um objeto em `projects.items` **nos dois idiomas**: número, categoria, título, contexto, problema, solução, métrica, resultado e descrição técnica (`implementation`). Organize a stack por finalidade em `technologyGroups` (título e itens); práticas técnicas ficam em `practices`, separadas das ferramentas. Não informe tecnologias ou links sem confirmação.
- A certificação atual é apresentada em `Certifications`, em `PortfolioSections.tsx`. Para uma certificação adicional, acrescente conteúdo PT/EN e um novo artigo semântico, mantendo emissor e categoria reais. Não crie credenciais ou verificações presumidas.
- Categorias e tecnologias ficam em `technologies.groups` nas duas traduções, sem classificações de proficiência. GitHub Pages é hospedagem/deploy; GitHub Actions e Azure Pipelines são automação de CI/CD.
- A composição usa nove grupos: front-end, back-end/APIs, desktop/automação, dados/cache, versionamento/build/CI/CD, cloud, qualidade, analytics/infraestrutura de aplicações e desenvolvimento assistido por IA. A partir de 768px são duas colunas CSS, com leitura de cima para baixo em cada coluna; abaixo disso, uma. Os cards têm altura natural, sem esticar categorias pequenas. `TechnologyTags` reutiliza a apresentação de tags nos projetos e nas categorias; as stacks dos projetos usam agrupamentos compactos. Claude (Anthropic), OpenAI Codex e GitHub Copilot são ferramentas de apoio ao desenvolvimento, sem afirmações sobre treinamento de modelos ou ganhos de produtividade. A propriedade `practices` do grupo desktop/automação mantém conceitos separados das ferramentas, dentro do próprio card.
- A experiência mantém dois cards. O primeiro distingue os vínculos da Compass UOL por meio de `additionalRoles`; cada vínculo tem título, detalhes, responsabilidades e tecnologias próprios. O segundo não recebe datas. A formação possui instituição e período por item, incluindo previsão explícita no mestrado.
- O link direto da certificação fica em `AWS_CERTIFICATION_URL`, em `PortfolioSections.tsx`; utilize somente o endereço real informado pelo proprietário.
- O logotipo AWS está em `src/assets/aws-logo.svg`, importado localmente pelo Vite, sem dependência de servidor externo. Fonte e atribuição estão em `src/assets/README.md`; licença e aviso são copiados para `dist/licenses/`. A apresentação é monocromática branca, com transparência e geometria original preservada, integrada ao cabeçalho compacto do card escuro.
- Links profissionais estão em `SOCIAL`; o e-mail está em `src/domain/contact.ts`. Mantenha os dados estruturados de `index.html` em sincronia ao alterá-los.

Idioma inicial: preferência válida em `portfolio.language` → idioma primário do navegador (PT/EN) → português. Idiomas não suportados usam PT. Tema inicial: `portfolio.theme` válido → `prefers-color-scheme`. Alterações manuais persistem. Se o acesso ao `localStorage` falhar, a interface continua funcionando em memória. O tema e a meta `theme-color` são aplicados no HTML antes do React para reduzir flash visual; as trocas manuais mantêm essa meta sincronizada.

## Contato com Formspree

O formulário envia `name`, `email`, `subject` e `message` por POST JSON para **https://formspree.io/f/moeeapay**, com `Accept: application/json`. O endereço está centralizado em `src/config/contact.ts`: o ID é público e já fica disponível no build, sem variável de ambiente ou segredo adicional no GitHub Pages. Não há backend próprio, redirecionamento ou abertura de aplicativo de e-mail.

Todos os campos são obrigatórios e normalizados com `trim`. Limites: nome 100, e-mail 254, assunto 160 e mensagem 5.000 caracteres. Nome e assunto não aceitam quebras de linha. Erros ficam associados aos campos; o foco vai ao primeiro inválido. Durante o envio, os campos são preservados e novos envios são bloqueados. Somente uma resposta HTTP bem-sucedida com confirmação JSON reconhecida limpa os campos. Erros HTTP, rede, JSON inválido, timeout de 15 segundos e limite de requisições preservam o conteúdo e permitem tentar novamente.

O honeypot `_gotcha` impede o envio local quando preenchido. Validação no navegador não impede todo spam: filtros e eventuais restrições do formulário continuam sob controle do Formspree. Não foi adicionado CAPTCHA. Veja [as decisões da integração](docs/formspree-2026-10-22.md).

**Copiar e-mail** é uma alternativa secundária e usa a porta de clipboard injetada. Seu status acessível informa sucesso ou falha; quando necessário, um campo somente leitura permite selecionar o endereço manualmente. Controles, validação e feedback acompanham PT/EN. Nenhum teste envia mensagens reais.

## Testes e cobertura

Vitest executa testes em jsdom. React Testing Library e userEvent consultam papéis e labels acessíveis. `renderWithProviders` aceita qualquer registry; componentes usam gateway falso, clipboard falso e preferências em memória. A integração também exercita composition root, providers e gateway reais, substituindo somente fronteiras externas como `fetch` e clipboard. Verifica preferências, envio, confirmação, falhas e recuperação. O setup bloqueia requisições reais por padrão. Não há snapshots como estratégia principal.

As cinco modalidades são unitários (Vitest), componentes (RTL), integração (Vitest/RTL), mutação (Stryker) e E2E (Playwright). E2E verifica navegação, conteúdo, temas/idiomas e persistência, formulário, erros JavaScript, seis larguras e auditoria axe. Requisições Formspree são bloqueadas por padrão e interceptadas com respostas simuladas nos fluxos de envio; a cópia usa a Clipboard API real do Chrome em um fluxo e uma API indisponível em outro.

A cobertura inclui o código de produção, exceto bootstrap, contratos sem execução e traduções estáticas. Metas mínimas: **85% linhas**, **80% branches**, **85% funções** e **85% statements**. HTML em `coverage/index.html`.

### Mutação

Stryker **10.0.0** e `@stryker-mutator/vitest-runner` **10.0.0** estão instalados com Vitest e coverage **4.1.12**, conferidos por `npm ls`. O runner declara peer Vitest `>=2.0.0`. O lockfile fixa a árvore usada na verificação.

`stryker.config.json` inclui registry/inject/provider, preferências, validação/normalização de contato, endpoint público, gateway Formspree, persistência, clipboard, detecção de idioma e comportamento dos controles, header e formulário. Tipos, tradução estática, CSS e configurações de ferramentas ficam fora da mutação. O escopo acompanha as regras atuais, sem manter testes do antigo `mailto:` nem excluir lógica relevante para elevar o score.

- **Killed:** ao menos um teste detectou a alteração.
- **Survived:** os testes passaram apesar da alteração; investigar se há uma lacuna comportamental, alteração apenas visual ou equivalência.
- **No coverage:** a mutação não foi exercitada.
- **Timeout:** a alteração excedeu o limite; Stryker conta como detectada, mas isso não equivale a uma asserção explícita.
- **RuntimeError:** a ferramenta não conseguiu avaliar o mutante por erro de execução do runner; ele não conta como detecção. O histórico de investigação está no relatório de verificação.
- **Mutation score:** proporção de mutações detectadas entre as válidas, conforme cálculo do Stryker. Não representa percentual de código coberto.

Meta desejada **85%**. Thresholds: `high: 85`, `low: 70`, `break: 75`; abaixo de 75 o comando falha. Relatórios: `reports/mutation/mutation.html` e `mutation.json`. Execute a ferramenta antes de declarar resultados; a cobertura, sozinha, não demonstra sensibilidade dos testes.

Os resultados medidos e a análise de sobreviventes ficam em [docs/verification.md](docs/verification.md).

## Responsividade, acessibilidade e performance

Os tokens em `src/styles.css` centralizam espaçamento de seções (56/72/80px), padding dos projetos (32/36/40px) e texto secundário (12/14/15px). Eles reduzem os intervalos entre projetos, tecnologias e formação e melhoram a legibilidade sem alterar a tipografia expressiva do Hero. Não foram adicionadas fontes ou bibliotecas.

Os testes de navegador verificam **320, 375, 430, 768, 1024 e 1440px**, ambos os temas e idiomas, ausência de overflow horizontal e regras axe WCAG 2/2.1/2.2 AA. Fluxos adicionais cobrem menu, Escape, persistência, envio simulado e cópia indisponível. As barras dos cards de experiência são comparadas nos dois temas. Capturas reais ficam em `reports/responsive/` e `reports/formspree/`; relatório Playwright em `playwright-report/`. Verificações automáticas não substituem uma auditoria completa com leitores de tela e dispositivos reais.

Para repetir a auditoria Lighthouse, rode o build e o preview em outro terminal:

```sh
npm run build
npm run preview
# Em outro terminal:
npx --yes --package=lighthouse lighthouse http://127.0.0.1:4173/ --chrome-flags="--headless" --output=html --output=json --output-path=./reports/lighthouse
```

O relatório local é uma medição de laboratório; rede, hardware, versão do Chrome e hospedagem influenciam o resultado.

## SEO e URL de produção

Title, description, Open Graph, favicon e dados estruturados `Person` são fornecidos com fatos reais. O idioma e metadados mudam no cliente. Sem URL de produção definida, **canonical, `og:url` e sitemap não são inventados**.

Quando a URL real estiver disponível, configure `VITE_SITE_URL` com origem e caminho completo e `VITE_BASE_PATH` com o caminho de publicação (veja `.env.example`). O plugin do Vite emite canonical, `og:url` e `sitemap.xml` no build. `robots.txt` permite indexação; não contém URL falsa de sitemap. A URL do sitemap pode ser submetida ao buscador depois do deploy.

Uma SPA estática com troca de idioma no cliente não oferece URLs independentes PT/EN nem `hreflang` por página. Buscadores que não executam JavaScript veem os metadados PT do HTML; compartilhadores podem ignorar mudanças feitas pelo React. Para indexação separada por idioma, uma evolução futura exigiria prerenderização ou páginas próprias, fora do escopo desta SPA.

## CI e deploy no GitHub Pages

1. Adicione o repositório remoto real e envie o código para a branch `main`.
2. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.
3. O workflow `deploy.yml` roda em push para `main` ou execução manual. Ele valida lint, tipos, cobertura e build antes de publicar.
4. `actions/configure-pages` fornece `base_path` e `base_url` da configuração real. O build recebe essas saídas como `VITE_BASE_PATH` e `VITE_SITE_URL`, suportando repositório convencional, repositório `usuario.github.io` ou domínio configurado, sem fixar nome fictício.
5. O job de deploy publica o artefato `dist/` e expõe a URL retornada por GitHub Pages.

`ci.yml` valida lint, tipos, formatação, testes unitários, testes de componentes, testes de integração, cobertura e build em push/PR. A mutação é um job separado, ativado manualmente em **Actions → CI → Run workflow → mutation**, com relatório como artefato, inclusive em falha. O deploy não depende desse job custoso.

Para testar um caminho de repositório localmente no PowerShell:

```powershell
$env:VITE_BASE_PATH = '/nome-real-do-repositorio/'
npm run build
Remove-Item Env:VITE_BASE_PATH
```

Em Bash: `VITE_BASE_PATH=/nome-real-do-repositorio/ npm run build`. A pasta `dist` deve ser servida sob o mesmo caminho usado no build.

Referências: [deploy estático do Vite](https://vite.dev/guide/static-deploy.html), [workflows do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [runner Vitest do Stryker](https://stryker-mutator.io/docs/stryker-js/vitest-runner/).
