import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const browserErrors = new WeakMap<Page, string[]>();
const contactEndpoint = 'https://formspree.io/f/moeeapay';
const certificationUrl =
  'https://cp.certmetrics.com/amazon/en/public/verify/credential/f844a9917d974a3bb153aeb58edf6d2c';
test.beforeEach(async ({ page, context }) => {
  await context.route('https://formspree.io/**', (route) =>
    route.abort('blockedbyclient'),
  );
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    const simulatedTransportError =
      message.location().url.startsWith('https://formspree.io/') &&
      message.text().includes('Failed to load resource');
    if (message.type() === 'error' && !simulatedTransportError)
      errors.push(message.text());
  });
});
test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page)).toEqual([]);
});

for (const width of [320, 375, 430, 768, 1024, 1440]) {
  test(`responsive and accessible at ${width}px in both themes and languages`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const language of ['pt-BR', 'en'])
      for (const theme of ['light', 'dark']) {
        await page.addInitScript(
          ({ language, theme }) => {
            localStorage.setItem('portfolio.language', language);
            localStorage.setItem('portfolio.theme', theme);
          },
          { language, theme },
        );
        await page.goto('/');
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(
          'Ricardo Costa.',
        );
        await expect(page.locator('html')).toHaveAttribute('lang', language);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
          'content',
          theme === 'dark' ? '#141414' : '#f7f7f4',
        );
        const layout = await page.evaluate(() => ({
          viewport: innerWidth,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
        }));
        expect(layout.document).toBeLessThanOrEqual(layout.viewport);
        expect(layout.body).toBeLessThanOrEqual(layout.viewport);
        await expect(
          page.getByRole('button', {
            name: language === 'en' ? 'Send message' : 'Enviar mensagem',
          }),
        ).toBeEnabled();
        const fieldPositions = await page
          .locator('.contact-field')
          .evaluateAll((fields) =>
            fields.map((field) => {
              const rect = field.getBoundingClientRect();
              return { x: rect.x, y: rect.y, width: rect.width };
            }),
          );
        expect(fieldPositions).toHaveLength(4);
        if (width >= 640) {
          expect(fieldPositions[0]!.y).toBe(fieldPositions[1]!.y);
          expect(fieldPositions[0]!.x).toBeLessThan(fieldPositions[1]!.x);
          expect(fieldPositions[2]!.width).toBeGreaterThan(
            fieldPositions[0]!.width,
          );
        } else {
          for (let index = 1; index < fieldPositions.length; index++) {
            expect(fieldPositions[index]!.x).toBe(fieldPositions[0]!.x);
            expect(fieldPositions[index]!.y).toBeGreaterThan(
              fieldPositions[index - 1]!.y,
            );
          }
        }
        await expect(
          page.locator('#certifications .text-link'),
        ).toHaveAttribute('href', certificationUrl);
        await expect(
          page.locator('#technologies .technology-group'),
        ).toHaveCount(9);
        const ai = page.locator('#technologies .technology-group').last();
        await expect(ai).toContainText('09');
        for (const tool of [
          'Claude (Anthropic)',
          'OpenAI Codex',
          'GitHub Copilot',
        ])
          await expect(ai.getByText(tool, { exact: true })).toBeVisible();
        const fiscalCase = page.locator('.project-card').first();
        await expect(fiscalCase.locator('.project-stack-group')).toHaveCount(4);
        await expect(
          page.locator('.project-card').nth(1).locator('.project-stack-group'),
        ).toHaveCount(5);
        await expect(
          fiscalCase.getByText('FXML', { exact: true }),
        ).toBeVisible();
        await expect(fiscalCase.getByText('HTML', { exact: true })).toHaveCount(
          0,
        );
        await expect(
          page.locator('#technologies').getByText('HTML', { exact: true }),
        ).toBeVisible();
        await expect(fiscalCase.locator('.project-practices')).toContainText(
          language === 'en'
            ? 'Concurrent Programming'
            : 'Programação concorrente',
        );
        await expect(page.locator('#experience h3').first()).toHaveText(
          language === 'en'
            ? 'Trainee Software Developer'
            : 'Desenvolvedor Trainee',
        );
        await expect(page.locator('body')).not.toContainText(
          language === 'en' ? '1 year and 6 months' : '1 ano e 6 meses',
        );
        const technologyLayout = await page
          .locator('.technology-group')
          .evaluateAll((groups) =>
            groups.map((group) => {
              const rect = group.getBoundingClientRect();
              return { x: rect.x, y: rect.y };
            }),
          );
        if (width >= 768) {
          const columns = [
            ...new Set(technologyLayout.map((group) => group.x)),
          ];
          expect(columns).toHaveLength(2);
          for (const x of columns) {
            const column = technologyLayout.filter((group) => group.x === x);
            for (let index = 1; index < column.length; index++)
              expect(column[index]!.y).toBeGreaterThan(column[index - 1]!.y);
          }
        } else {
          for (let index = 1; index < technologyLayout.length; index++) {
            expect(technologyLayout[index]!.x).toBe(technologyLayout[0]!.x);
            expect(technologyLayout[index]!.y).toBeGreaterThan(
              technologyLayout[index - 1]!.y,
            );
          }
        }
        const typography = await page
          .locator(
            '.eyebrow, .mono, .project-context, .project-details p, .education-item p, .status-tag',
          )
          .evaluateAll((nodes) =>
            nodes
              .filter((node) => getComputedStyle(node).display !== 'none')
              .map((node) => parseFloat(getComputedStyle(node).fontSize)),
          );
        expect(Math.min(...typography)).toBeGreaterThanOrEqual(12);
        const technologyBorders = await page
          .locator('.technology-group li')
          .evaluateAll((items) =>
            items.map((item) => getComputedStyle(item).borderTopWidth),
          );
        expect(technologyBorders.every((border) => border === '1px')).toBe(
          true,
        );
        for (const project of await page.locator('.project-card').all()) {
          const content = await project
            .locator('.project-content')
            .boundingBox();
          const result = await project.locator('.project-result').boundingBox();
          const tags = await project
            .locator('.project-technologies')
            .boundingBox();
          const details = await project
            .locator('.project-details')
            .boundingBox();
          expect(tags!.y).toBeGreaterThanOrEqual(details!.y + details!.height);
          expect(tags!.x).toBe(content!.x);
          expect(tags!.y + tags!.height).toBeLessThanOrEqual(
            content!.y + content!.height + 1,
          );
          const borders = await project
            .locator('.project-result')
            .evaluate((node) => {
              const style = getComputedStyle(node);
              return {
                top: style.borderTopWidth,
                right: style.borderRightWidth,
                bottom: style.borderBottomWidth,
                left: style.borderLeftWidth,
              };
            });
          expect(borders.right).toBe('0px');
          expect(borders.bottom).toBe('0px');
          expect(width >= 768 ? borders.top : borders.left).toBe('0px');
          const tagHeights = await project
            .locator('.technology-tags li')
            .evaluateAll((nodes) =>
              nodes.map((node) =>
                Math.round(node.getBoundingClientRect().height),
              ),
            );
          expect(new Set(tagHeights).size).toBe(1);
          if (width >= 768) expect(result!.x).toBeGreaterThan(content!.x);
          else {
            expect(result!.x).toBe(content!.x);
            expect(result!.y).toBeGreaterThan(content!.y + content!.height);
          }
        }
        const logo = page.getByRole('img', {
          name: 'Amazon Web Services (AWS)',
        });
        await logo.scrollIntoViewIfNeeded();
        await expect(logo).toBeVisible();
        const logoStyle = await page.locator('.aws-mark').evaluate((node) => ({
          background: getComputedStyle(node).backgroundColor,
          width: node.getBoundingClientRect().width,
        }));
        expect(logoStyle.background).toBe('rgba(0, 0, 0, 0)');
        expect(logoStyle.width).toBeLessThanOrEqual(56);
        const brand = await page.locator('.certification-brand').boundingBox();
        const level = await page
          .locator('.certification-card .status-tag')
          .boundingBox();
        if (width >= 375)
          expect(level!.y).toBeLessThan(brand!.y + brand!.height);
        const credentialTitle = await page
          .locator('.certification-card h3')
          .boundingBox();
        expect(credentialTitle!.y).toBeGreaterThanOrEqual(
          brand!.y + brand!.height,
        );
        expect(
          await logo.evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
        ).toBe(true);
        const bars = await page
          .locator('.experience-card')
          .evaluateAll((cards) =>
            cards.map((card) => {
              const style = getComputedStyle(card);
              return {
                width: style.borderTopWidth,
                color: style.borderTopColor,
                background: style.backgroundColor,
              };
            }),
          );
        expect(bars).toHaveLength(2);
        expect(bars[0]).toEqual(bars[1]);
        expect(bars[0]!.width).toBe('3px');
        expect(bars[0]!.color).not.toBe(bars[0]!.background);
        const accessibility = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(accessibility.violations).toEqual([]);
        if (language === 'pt-BR' && theme === 'light')
          await page.screenshot({
            path: `reports/responsive/${width}.png`,
            fullPage: true,
          });
        await page.locator('#technologies').screenshot({
          path: `reports/refinement/technologies-${width}-${language}-${theme}.png`,
          // Hide fixed overlays only for the tall crop; viewport navigation is checked below.
          style: '.site-header, .skip-link { visibility: hidden !important; }',
        });
        if (width === 375 || width === 1440)
          await page.locator('#contact').screenshot({
            path: `reports/formspree/contact-${width}-${language}-${theme}.png`,
            style:
              '.site-header, .skip-link { visibility: hidden !important; }',
          });
      }
  });
}

test('mobile navigation, preferences, Formspree submission and secondary email copying', async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(() => {
    if (!localStorage.getItem('portfolio.language'))
      localStorage.setItem('portfolio.language', 'pt-BR');
    if (!localStorage.getItem('portfolio.theme'))
      localStorage.setItem('portfolio.theme', 'light');
  });
  await page.goto('/');
  const menu = page.getByRole('button', { name: /Abrir menu|Fechar menu/ });
  await expect(page.getByRole('navigation')).toBeHidden();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Projetos' })
    .click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#projects')).toBeInViewport();
  await expect(page.locator('#projects')).toContainText('98%');
  await expect(page.locator('#projects')).toContainText('≈80%');
  await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
  await page
    .getByRole('button', { name: 'PT / EN: mudar para inglês' })
    .click();
  expect(
    await page.evaluate(() => ({
      theme: localStorage.getItem('portfolio.theme'),
      language: localStorage.getItem('portfolio.language'),
    })),
  ).toEqual({ theme: 'dark', language: 'en' });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Technologies' })
    .click();
  const technologyTitle = await page
    .getByRole('heading', { name: 'Technologies and practices.' })
    .boundingBox();
  const header = await page.locator('.site-header').boundingBox();
  expect(technologyTitle!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
  await page.screenshot({
    path: 'reports/refinement/mobile-navigation-dark-en.png',
  });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Certifications' })
    .click();
  await expect(page).toHaveURL(/#certifications$/);
  await expect(
    page.getByRole('heading', { name: 'AWS Certified Cloud Practitioner' }),
  ).toBeInViewport();
  await expect(
    page.getByRole('link', { name: /View Credential/ }),
  ).toHaveAttribute('href', certificationUrl);
  await context.route(certificationUrl, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<title>Credential destination fixture</title>',
    }),
  );
  const credentialTab = page.waitForEvent('popup');
  await page.getByRole('link', { name: /View Credential/ }).click();
  const popup = await credentialTab;
  await popup.waitForLoadState();
  expect(popup.url()).toBe(certificationUrl);
  await popup.close();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Contact', exact: true })
    .click();
  await expect(page).toHaveURL(/#contact$/);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(
    page.getByRole('textbox', { name: 'Name', exact: true }),
  ).toBeFocused();
  await expect(page.getByText('Required field.', { exact: true })).toHaveCount(
    4,
  );
  await page
    .getByRole('textbox', { name: 'Name', exact: true })
    .fill('Browser Test');
  await page
    .getByRole('textbox', { name: 'Best email to reach you', exact: true })
    .fill('invalid');
  await page
    .getByRole('textbox', { name: 'Subject', exact: true })
    .fill('Project & integration');
  await page
    .getByRole('textbox', { name: 'Message', exact: true })
    .fill('A real business process to improve.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(
    page.getByRole('textbox', { name: 'Best email to reach you', exact: true }),
  ).toBeFocused();
  await expect(
    page.getByText('Enter a valid email address.', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Best email to reach you', exact: true })
    .fill('visitor@example.com');
  let acknowledge!: () => void;
  const confirmation = new Promise<void>((resolve) => {
    acknowledge = resolve;
  });
  let submissions = 0;
  await context.route(contactEndpoint, async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'content-type',
        },
      });
      return;
    }
    submissions++;
    expect(route.request().method()).toBe('POST');
    expect(route.request().headers().accept).toBe('application/json');
    expect(route.request().postDataJSON()).toEqual({
      name: 'Browser Test',
      email: 'visitor@example.com',
      subject: 'Project & integration',
      message: 'A real business process to improve.',
      _gotcha: '',
    });
    await confirmation;
    await route.fulfill({
      status: 200,
      json: { next: 'https://formspree.io/thanks' },
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  });
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('button', { name: 'Sending...' })).toBeDisabled();
  await expect(
    page.getByRole('textbox', { name: 'Name', exact: true }),
  ).toHaveValue('Browser Test');
  await page
    .getByRole('form', { name: 'Contact form' })
    .evaluate((form) => (form as HTMLFormElement).requestSubmit());
  acknowledge();
  await expect(
    page.getByRole('status', { name: 'Message status' }),
  ).toContainText('Message sent successfully!');
  expect(submissions).toBe(1);
  await expect(
    page.getByRole('textbox', { name: 'Name', exact: true }),
  ).toHaveValue('');
  await expect(page).toHaveURL(/#contact$/);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy email', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Copy status' })).toHaveText(
    'Email copied',
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'contato.ricardolhc@gmail.com',
  );
});

test('section content appears during normal motion without leaving blank areas', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  for (const id of ['projects', 'technologies', 'education']) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(section.locator('div[style]').first()).toHaveCSS(
      'opacity',
      '1',
    );
  }
});

test('mobile clipboard unavailable fallback remains usable and translated', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await page.addInitScript(() => {
    localStorage.setItem('portfolio.language', 'pt-BR');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Copiar e-mail' }).click();
  await expect(
    page.getByRole('status', { name: 'Status da cópia' }),
  ).toContainText('Selecione e copie o endereço abaixo.');
  const address = page.getByRole('textbox', {
    name: 'E-mail para copiar manualmente',
  });
  await address.selectText();
  await expect(address).toHaveValue('contato.ricardolhc@gmail.com');
  await expect(address).toHaveAttribute('readonly', '');
  await page
    .getByRole('button', { name: 'PT / EN: mudar para inglês' })
    .click();
  await expect(page.getByRole('status', { name: 'Copy status' })).toContainText(
    'Select and copy the address below.',
  );
  await expect(
    page.getByRole('button', { name: 'Send message' }),
  ).toBeEnabled();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});

for (const failure of ['rejected', 'rateLimited', 'invalid', 'network']) {
  test(`Formspree ${failure} preserves the draft, translates feedback and permits retry`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addInitScript(() =>
      localStorage.setItem('portfolio.language', 'pt-BR'),
    );
    await context.route(contactEndpoint, (route) =>
      failure === 'network'
        ? route.abort('failed')
        : route.fulfill({
            status:
              failure === 'rateLimited'
                ? 429
                : failure === 'rejected'
                  ? 422
                  : 200,
            contentType:
              failure === 'invalid' ? 'text/html' : 'application/json',
            body:
              failure === 'invalid'
                ? '<html>bad response</html>'
                : '{"errors":[{"message":"private server detail"}]}',
            headers: { 'Access-Control-Allow-Origin': '*' },
          }),
    );
    await page.goto('/');
    for (const [label, value] of [
      ['Nome', 'Ana Silva'],
      ['Seu melhor e-mail', 'visitor@example.com'],
      ['Assunto', 'Projeto & integração'],
      ['Mensagem', 'Um processo empresarial para melhorar.'],
    ])
      await page
        .getByRole('textbox', { name: label, exact: true })
        .fill(value!);
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(
      page.getByRole('status', { name: 'Status da mensagem' }),
    ).toContainText(
      failure === 'rateLimited'
        ? 'Muitas tentativas'
        : 'Não foi possível enviar',
    );
    await expect(page.getByRole('textbox', { name: 'Nome' })).toHaveValue(
      'Ana Silva',
    );
    await expect(page.getByText('private server detail')).toHaveCount(0);
    await page
      .getByRole('button', { name: 'PT / EN: mudar para inglês' })
      .click();
    await expect(
      page.getByRole('status', { name: 'Message status' }),
    ).toContainText(
      failure === 'rateLimited'
        ? 'Too many attempts'
        : 'Could not send your message',
    );
    await context.route(contactEndpoint, (route) =>
      route.fulfill({
        status: 200,
        json: { next: 'https://formspree.io/thanks' },
        headers: { 'Access-Control-Allow-Origin': '*' },
      }),
    );
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(
      page.getByRole('status', { name: 'Message status' }),
    ).toContainText('Message sent successfully!');
    await expect(
      page.getByRole('textbox', { name: 'Name', exact: true }),
    ).toHaveValue('');
  });
}
