import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const browserErrors = new WeakMap<Page, string[]>();
const certificationUrl =
  'https://cp.certmetrics.com/amazon/en/public/verify/credential/f844a9917d974a3bb153aeb58edf6d2c';
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
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
          page.getByRole('link', {
            name: language === 'en' ? 'Send email' : 'Enviar e-mail',
          }),
        ).toHaveAttribute(
          'href',
          language === 'en'
            ? 'mailto:contato.ricardolhc@gmail.com?subject=Portfolio%20contact'
            : 'mailto:contato.ricardolhc@gmail.com?subject=Contato%20pelo%20portf%C3%B3lio',
        );
        await expect(
          page.locator('#certifications .text-link'),
        ).toHaveAttribute('href', certificationUrl);
        await expect(
          page.locator('#technologies .technology-group'),
        ).toHaveCount(6);
        await expect(page.locator('#experience h3').first()).toHaveText(
          language === 'en'
            ? 'Full Stack Developer'
            : 'Desenvolvedor Full Stack',
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
          for (const row of [0, 2, 4]) {
            expect(technologyLayout[row]!.x).toBe(technologyLayout[0]!.x);
            expect(technologyLayout[row + 1]!.x).toBe(technologyLayout[1]!.x);
            expect(technologyLayout[row]!.y).toBe(technologyLayout[row + 1]!.y);
          }
          expect(technologyLayout[1]!.x).toBeGreaterThan(
            technologyLayout[0]!.x,
          );
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
        expect(technologyBorders.every((border) => border === '0px')).toBe(
          true,
        );
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
      }
  });
}

test('mobile navigation, keyboard, persistence and native contact fallback', async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(() => {
    if (!localStorage.getItem('portfolio.language'))
      localStorage.setItem('portfolio.language', 'pt-BR');
    if (!localStorage.getItem('portfolio.theme'))
      localStorage.setItem('portfolio.theme', 'light');
    document.addEventListener('click', (event) => {
      const target = event.target as Element;
      const link = target.closest('a[href^="mailto:"]');
      if (link) {
        event.preventDefault();
        document.documentElement.dataset.emailClick =
          link.getAttribute('href')!;
      }
    });
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
    page.getByRole('link', { name: /View certification/ }),
  ).toHaveAttribute('href', certificationUrl);
  await context.route(certificationUrl, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<title>Credential destination fixture</title>',
    }),
  );
  const credentialTab = page.waitForEvent('popup');
  await page.getByRole('link', { name: /View certification/ }).click();
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
  await page.getByRole('link', { name: 'Send email', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-email-click',
    'mailto:contato.ricardolhc@gmail.com?subject=Portfolio%20contact',
  );
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy email', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Email copied');
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
  await expect(page.getByRole('status')).toContainText(
    'Selecione e copie o endereço abaixo.',
  );
  const address = page.getByRole('textbox', {
    name: 'E-mail para copiar manualmente',
  });
  await address.selectText();
  await expect(address).toHaveValue('contato.ricardolhc@gmail.com');
  await expect(address).toHaveAttribute('readonly', '');
  await page
    .getByRole('button', { name: 'PT / EN: mudar para inglês' })
    .click();
  await expect(page.getByRole('status')).toContainText(
    'Select and copy the address below.',
  );
  await expect(page.getByRole('link', { name: 'Send email' })).toHaveAttribute(
    'href',
    'mailto:contato.ricardolhc@gmail.com?subject=Portfolio%20contact',
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});
