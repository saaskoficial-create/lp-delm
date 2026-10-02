import { readFile, writeFile } from 'node:fs/promises'
import { createServer, loadEnv } from 'vite'

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env }
const origin = env.SITE_URL ? new URL(env.SITE_URL).origin : ''
if (origin && !/^https?:\/\//.test(origin)) throw new Error('SITE_URL deve ser uma URL HTTP(S) pública.')
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
let template = await readFile('dist/index.html', 'utf8')
// Small LP stylesheet is inlined to remove a render-blocking request.
for (const match of template.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)) {
  const css = await readFile(`dist${match[1]}`, 'utf8')
  template = template.replace(match[0], `<style>${css}</style>`)
}
template = template.replaceAll('rel="modulepreload"', 'rel="modulepreload" fetchpriority="low"').replace('type="module" crossorigin', 'type="module" fetchpriority="low" crossorigin')
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.tsx')
  const graph = [
    { '@type': 'Organization', name: 'DELM', ...(origin ? { '@id': `${origin}/#organization`, url: `${origin}/`, logo: `${origin}/brand/delm-symbol.webp` } : {}) },
    { '@type': 'Service', name: 'Sistemas, integrações e automações sob medida', description: 'Desenvolvimento de software e integrações para empresas B2B e operações logísticas.', serviceType: 'Desenvolvimento de software sob medida', provider: { '@type': 'Organization', name: 'DELM' }, areaServed: { '@type': 'Country', name: 'Brasil' } },
    { '@type': 'WebPage', name: 'DELM — Sistemas, integrações e automações sob medida', inLanguage: 'pt-BR', ...(origin ? { url: `${origin}/` } : {}) },
  ]
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')
  const seo = `<script type="application/ld+json">${json}</script>` + (origin ? `<link rel="canonical" href="${escape(`${origin}/`)}" /><meta property="og:url" content="${escape(`${origin}/`)}" /><meta property="og:image" content="${origin}/images/operacao-real-1100.webp" /><meta name="twitter:image" content="${origin}/images/operacao-real-1100.webp" />` : '')
  await writeFile('dist/index.html', template.replace('<div id="root"></div>', `<div id="root">${render()}</div>`).replace('</head>', `${seo}</head>`))
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`)
  if (origin) await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(`${origin}/`)}</loc></url></urlset>`)
  console.log('DELM pré-renderizada: dez seções em HTML, metadados, Schema.org e GTM preservado.')
} finally { await server.close() }
