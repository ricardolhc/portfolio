import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.VITE_SITE_URL?.replace(/\/$/, '');
  const seo: Plugin = {
    name: 'production-seo',
    transformIndexHtml(html) {
      if (!siteUrl) return html;
      const url = new URL(`${siteUrl}/`);
      if (!['https:', 'http:'].includes(url.protocol))
        throw new Error('VITE_SITE_URL must be HTTP(S)');
      const escaped = url.href
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('<', '&lt;');
      return html.replace(
        '</head>',
        `<link rel="canonical" href="${escaped}" /><meta property="og:url" content="${escaped}" /></head>`,
      );
    },
    generateBundle() {
      if (siteUrl) {
        const url = new URL(`${siteUrl}/`).href
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;');
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}</loc></url></urlset>`,
        });
      }
    },
  };
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), tailwindcss(), seo],
  };
});
