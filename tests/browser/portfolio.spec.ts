import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
        const layout = await page.evaluate(() => ({
          viewport: innerWidth,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
        }));
        expect(layout.document).toBeLessThanOrEqual(layout.viewport);
        expect(layout.body).toBeLessThanOrEqual(layout.viewport);
        await expect(
          page.getByRole('button', {
            name:
              language === 'en'
                ? 'Open email application'
                : 'Abrir aplicativo de e-mail',
          }),
        ).toBeEnabled();
        const accessibility = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(accessibility.violations).toEqual([]);
        if (language === 'pt-BR' && theme === 'light')
          await page.screenshot({
            path: `reports/responsive/${width}.png`,
            fullPage: true,
          });
      }
  });
}

test('mobile navigation, keyboard, persistence and native contact fallback', async ({
  page,
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
  await page.getByRole('button', { name: 'Open email application' }).click();
  await expect(page.getByLabel('Name', { exact: true })).toBeFocused();
  await expect(page.getByLabel('Name', { exact: true })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await page.getByLabel('Name', { exact: true }).fill('Browser Test');
  await page.getByLabel('Email', { exact: true }).fill('visitor@example.com');
  await page
    .getByLabel('Subject', { exact: true })
    .fill('Projeto & integração');
  await page
    .getByLabel('Message', { exact: true })
    .fill('Olá Ricardo, vamos conversar sobre software.');
  // Copying prepares the same message without launching an email application.
  await page.getByRole('button', { name: 'Copy message', exact: true }).click();
  await expect(page.getByLabel('Message to copy', { exact: true })).toHaveValue(
    'Projeto & integração\n\nName: Browser Test\nEmail: visitor@example.com\n\nMessage:\nOlá Ricardo, vamos conversar sobre software.',
  );
});
