import { test, expect } from '@playwright/test'

test('all ten sections are indexable without JavaScript', async ({ browser, request, baseURL }) => {
  const response = await request.get('/')
  const html = await response.text()
  expect(response.status()).toBe(200)
  expect(/<h1[^>]*id="hero-title"/.test(html)).toBe(true)
  expect(html).toContain('application/ld+json')
  expect(html).toContain("'GTM-P8ZS3GSZ'")
  expect(html).toMatch(/<body>\s*<!-- Google Tag Manager \(noscript\) -->/)
  expect(html).not.toContain('rel="stylesheet"')
  expect(html).not.toMatch(/rel="modulepreload"[^>]+gsap-vendor/)
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 390, height: 900 } })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('main > section')).toHaveCount(10)
  await expect(page.locator('.logistics-copy')).toHaveCSS('opacity', '1')
  await context.close()
})

test('hydration, structured data and crawl policy', async ({ page, request }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Quero analisar minha operação' })).toBeDisabled()
  const schema = await page.locator('script[type="application/ld+json"]').textContent()
  expect(JSON.parse(schema!)['@graph'].map((item: { '@type': string }) => item['@type'])).toEqual(['Organization', 'Service', 'WebPage'])
  expect((await request.get('/robots.txt')).headers()['content-type']).toContain('text/plain')
  expect(errors).toEqual([])
})
