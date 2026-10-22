# Ricardo Costa · Portfólio Full Stack

Portfólio profissional de página única com React, Vite e TypeScript estrito. Apresenta experiência CLT em front-end, desenvolvimento independente de soluções empresariais, formação em Engenharia de Software e certificação AWS.

A identidade visual é editorial e monocromática, com fonte Geist hospedada no próprio build. Não há analytics, backend, fontes remotas, dados de clientes ou serviços de formulário.

## Funcionalidades

- Seções de apresentação, sobre, experiência, projetos, tecnologias, formação, certificação e contato.
- Português brasileiro e inglês completos; alternância persistente e `lang` atualizado.
- Tema claro/escuro com preferência inicial do sistema e escolha manual persistente.
- Navegação por âncoras, menu mobile com Escape, foco visível e link para pular navegação.
- Transições discretas com Motion e respeito a `prefers-reduced-motion`.
- Formulário validado que prepara um `mailto:` e alternativas para copiar endereço e mensagem.
- Registry tipado, singleton/factory, detecção de ciclos, Context e serviços substituíveis nos testes.
- CI, cobertura, testes de mutação e deploy GitHub Pages.

O período de **1 ano e 6 meses** corresponde exclusivamente à experiência **CLT**, conforme o briefing de outubro de 2026. Projetos independentes são apresentados separadamente. Não foram inventados empregador, datas, contratos, tecnologias dos projetos, URLs de demonstração, depoimentos ou dados de credenciais.

## Requisitos e instalação

Node.js **22.12+**, recomendado **24 LTS**, e npm. A instalação é reproduzível pelo `package-lock.json`.

```sh
npm ci
npm run dev
```

Abra a URL local impressa pelo Vite, normalmente `http://127.0.0.1:5173/`.

## Comandos

| Comando                  | Finalidade                                      |
| ------------------------ | ----------------------------------------------- |
| `npm run dev`            | Servidor de desenvolvimento                     |
| `npm run build`          | TypeScript e build de produção em `dist/`       |
| `npm run preview`        | Servir o build localmente                       |
| `npm run lint`           | ESLint sem warnings permitidos                  |
| `npm run typecheck`      | Verificar todos os arquivos TypeScript          |
| `npm run format`         | Formatar com Prettier                           |
| `npm run format:check`   | Verificar formatação                            |
| `npm test`               | Todos os testes Vitest, sem modo watch          |
| `npm run test:unit`      | Registry, serviços, validações e infraestrutura |
| `npm run test:component` | Interações de componentes e providers           |
| `npm run test:coverage`  | Cobertura V8, terminal e HTML                   |
| `npm run test:mutation`  | Stryker, terminal, HTML e JSON                  |
| `npm run test:e2e`       | Chrome/Playwright, responsividade e axe         |

Testes no navegador usam o build: execute `npm run build` primeiro. Localmente, o Playwright usa o Chrome instalado. Em CI (`CI=true`), usa Chromium; instale-o com `npx playwright install --with-deps chromium`. O servidor de preview é iniciado pelo Playwright quando necessário.

## Organização e arquitetura

```text
src/
  core/di/                  # Registry, tokens, inject, useInject, Context
  domain/                   # Contratos e regras de validação do contato
  application/              # Contato, preferências, detecção de idioma e tokens
  infrastructure/           # Adapters para browser/storage/mail/clipboard
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
  browser/                  # Playwright + axe, sem envio real de e-mail
  renderWithProviders.tsx   # Registry específico por teste
.github/workflows/          # CI e Pages
```

**Domain** contém os contratos e validações. **Application** prepara mensagens e coordena preferências. **Infrastructure** implementa os efeitos do navegador. **Presentation** conhece contratos e tokens, sem instanciar infraestrutura. **Core** fornece a DI. O composition root monta o grafo antes da renderização.

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

Crie um registry novo, em vez de alterar singletons globais. Por exemplo, um fake de contato sem efeitos externos:

```tsx
import { Registry } from './src/core/di/registry';
import { TOKENS } from './src/application/tokens';
import { PreferenceService } from './src/application/preference-service';

const registry = new Registry()
  .register(TOKENS.contact, () => ({
    prepare: () => ({
      subject: 'Teste',
      body: 'Mensagem',
      href: 'mailto:test@example.com',
    }),
    open: () => {},
    copy: async () => {},
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
- Para adicionar um projeto, acrescente um objeto em `projects.items` **nos dois idiomas**: número, categoria, título, contexto, problema, solução, métrica e resultado. Não informe tecnologias ou links sem confirmação.
- A certificação atual é apresentada em `Certifications`, em `PortfolioSections.tsx`. Para uma certificação adicional, acrescente conteúdo PT/EN e um novo artigo semântico, mantendo emissor e categoria reais. Não crie credenciais ou verificações presumidas.
- Tecnologias estão agrupadas em `Technologies`, no mesmo arquivo, sem classificações de proficiência.
- Links profissionais estão em `SOCIAL`; o e-mail está em `src/domain/contact.ts`. Mantenha os dados estruturados de `index.html` em sincronia ao alterá-los.

Idioma inicial: preferência válida em `portfolio.language` → idioma primário do navegador (PT/EN) → português. Idiomas não suportados usam PT. Tema inicial: `portfolio.theme` válido → `prefers-color-scheme`. Alterações manuais persistem. Se o acesso ao `localStorage` falhar, a interface continua funcionando em memória. O tema é aplicado no HTML antes do React para reduzir flash visual.

## Contato nativo

Nome, e-mail, assunto e mensagem são obrigatórios. Os valores são aparados antes de validar/compor; limites de tamanho e quebras de linha em campos de cabeçalho são verificados. `encodeURIComponent` codifica assunto e corpo, incluindo Unicode, `&`, `?`, `+`, `%` e quebras de linha.

O botão **Abrir aplicativo de e-mail** solicita ao navegador a abertura de um `mailto:`. Isso **não envia a mensagem**. O visitante deve revisar e concluir o envio no seu cliente. A página não consegue confirmar se um handler de e-mail está instalado: navegadores podem ignorar a solicitação silenciosamente.

As opções **Copiar endereço** e **Copiar mensagem** permitem usar webmail. Se Clipboard API não estiver disponível ou a permissão falhar, endereço e mensagem continuam em campos somente leitura, selecionáveis. Nenhum conteúdo do formulário é armazenado ou enviado para um servidor. Mensagens muito longas podem atingir limites de URL do navegador/cliente; nesse caso use a cópia do texto. Nenhum teste abre um aplicativo real de e-mail.

## Testes e cobertura

Vitest executa testes em jsdom. React Testing Library e userEvent consultam papéis e labels acessíveis. `renderWithProviders` aceita qualquer registry; os testes usam serviços reais com portas de e-mail/clipboard falsas e persistência em memória. Não há snapshots como estratégia principal.

A cobertura inclui o código de produção, exceto bootstrap, contratos sem execução e traduções estáticas. Metas mínimas: **85% linhas**, **80% branches**, **85% funções** e **85% statements**. HTML em `coverage/index.html`.

### Mutação

Stryker **10.0.0** e `@stryker-mutator/vitest-runner` **10.0.0** estão instalados com Vitest e coverage **4.1.12**, conferidos por `npm ls`. O runner declara peer Vitest `>=2.0.0`. O lockfile fixa a árvore usada na verificação.

`stryker.config.json` inclui registry/inject/provider, serviços, validadores, composição, persistência, detecção de idioma, provider de preferências e comportamento de controles, header e formulário. Tipos, tradução estática, CSS e configurações ficam fora da mutação. Não se excluem regras de negócio para elevar o score.

- **Killed:** ao menos um teste detectou a alteração.
- **Survived:** os testes passaram apesar da alteração; investigar se há uma lacuna comportamental, alteração apenas visual ou equivalência.
- **No coverage:** a mutação não foi exercitada.
- **Timeout:** a alteração excedeu o limite; Stryker conta como detectada, mas isso não equivale a uma asserção explícita.
- **RuntimeError:** a ferramenta não conseguiu avaliar o mutante por erro de execução do runner; ele não conta como detecção. A execução desta entrega apresentou um caso, detalhado no relatório de verificação.
- **Mutation score:** proporção de mutações detectadas entre as válidas, conforme cálculo do Stryker. Não representa percentual de código coberto.

Meta desejada **85%**. Thresholds: `high: 85`, `low: 70`, `break: 75`; abaixo de 75 o comando falha. Relatórios: `reports/mutation/mutation.html` e `mutation.json`. Execute a ferramenta antes de declarar resultados; a cobertura, sozinha, não demonstra sensibilidade dos testes.

Os resultados medidos e a análise de sobreviventes ficam em [docs/verification.md](docs/verification.md).

## Responsividade, acessibilidade e performance

Os testes de navegador verificam **320, 375, 430, 768, 1024 e 1440px**, ambos os temas e idiomas, ausência de overflow horizontal e regras axe WCAG 2/2.1/2.2 AA. Um fluxo adicional cobre menu, Escape, persistência e formulário. Capturas reais ficam em `reports/responsive/`; relatório Playwright em `playwright-report/`. Verificações automáticas não substituem uma auditoria completa com leitores de tela e dispositivos reais.

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

`ci.yml` valida lint, tipos, formatação, testes unitários, testes de componentes, cobertura e build em push/PR. A mutação é um job separado, ativado manualmente em **Actions → CI → Run workflow → mutation**, com relatório como artefato, inclusive em falha. O deploy não depende desse job custoso.

Para testar um caminho de repositório localmente no PowerShell:

```powershell
$env:VITE_BASE_PATH = '/nome-real-do-repositorio/'
npm run build
Remove-Item Env:VITE_BASE_PATH
```

Em Bash: `VITE_BASE_PATH=/nome-real-do-repositorio/ npm run build`. A pasta `dist` deve ser servida sob o mesmo caminho usado no build.

Referências: [deploy estático do Vite](https://vite.dev/guide/static-deploy.html), [workflows do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [runner Vitest do Stryker](https://stryker-mutator.io/docs/stryker-js/vitest-runner/).

## Limitações e informações pendentes

- Não há remote Git configurado neste checkout nem URL pública definida. Os workflows são entregues; execução no GitHub e publicação dependem do repositório remoto e da ativação do Pages.
- Nome do empregador, datas profissionais/acadêmicas, duração dos serviços independentes e detalhes dos contratos não foram fornecidos e foram omitidos.
- Projetos privados não possuem links, screenshots ou tecnologias presumidas.
- A certificação não inclui emissão, validade, ID ou URL de credencial não informados.
- Não existe arquivo PDF de currículo; nenhum botão de download foi criado.
- Contato depende do cliente de e-mail do visitante ou de cópia manual; não há entrega automática nem confirmação de envio.
