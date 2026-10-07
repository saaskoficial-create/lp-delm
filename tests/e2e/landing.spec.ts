import { test, expect, type Page } from '@playwright/test'

async function fillLead(page: Page) {
  await page.getByLabel('Nome', { exact: true }).fill('Ana Oliveira')
  await page.getByLabel('E-mail corporativo').fill('ana@example.com')
  await page.getByLabel('WhatsApp', { exact: true }).fill('(11) 99999-9999')
  await page.getByLabel('Empresa', { exact: true }).fill('Operação Exemplo')
  await page.getByLabel('Qual é o seu segmento?').selectOption('Operador logístico')
  await page.getByLabel('Quantas pessoas trabalham na empresa?').selectOption('21 a 50')
  await page.getByLabel('Hoje, qual situação').selectOption('Nossos sistemas não conversam entre si')
  await page.getByLabel('O que você gostaria').fill('Precisamos integrar nosso ERP ao WMS.')
  await page.getByLabel('Qual é o momento do projeto?').selectOption('Nos próximos 3 meses')
}

for (const width of [360, 390, 768, 1440]) {
  test(`responsive content and real unconfigured state at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Se sua equipe criou planilhas para fazer o sistema funcionar, o sistema já falhou.')
    await expect(page.locator('main > section')).toHaveCount(10)
    if (width === 1440) {
      await expect(page.locator('h1')).toHaveCSS('font-family', '"Sora Variable", sans-serif')
      await expect(page.locator('body')).toHaveCSS('font-family', '"Inter Variable", sans-serif')
      expect(await page.evaluate(() => document.fonts.check('560 54px "Sora Variable"') && document.fonts.check('400 16px "Inter Variable"'))).toBe(true)
    }
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }))
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport)
    await expect(page.getByRole('button', { name: 'Quero analisar minha operação' })).toBeDisabled()
    await expect(page.getByText('O envio está temporariamente indisponível.', { exact: false })).toBeVisible()
    for (const image of await page.locator('img[loading="lazy"]').all()) {
      await image.scrollIntoViewIfNeeded()
      await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
      await image.evaluate((node) => (node as HTMLImageElement).decode())
    }
    for (const cta of await page.locator('a.cta-button').all()) await expect(cta).toHaveAttribute('href', '#diagnostico')
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({ path: `test-results/delm-${width}-hero.png` })
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/delm-${width}-full.png`, fullPage: true })
    if (width < 850) {
      await page.getByRole('button', { name: 'Abrir menu' }).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused()
      await page.getByRole('button', { name: 'Abrir menu' }).click()
      await page.getByRole('navigation', { name: 'Navegação mobile' }).getByRole('link', { name: 'Mapear meu gargalo' }).click()
    } else {
      await page.locator('.hero-copy').getByRole('link', { name: 'Quero mapear meu gargalo' }).click()
    }
    await expect(page).toHaveURL(/#diagnostico$/)
    await expect(page.getByRole('heading', { name: 'Conte um pouco sobre sua empresa.' })).toBeInViewport()
    await expect.poll(() => page.locator('#diagnostico').evaluate((node) => node.getBoundingClientRect().top)).toBeGreaterThanOrEqual(70)
    await expect.poll(() => page.locator('#diagnostico').evaluate((node) => node.getBoundingClientRect().top)).toBeLessThan(130)
    await page.screenshot({ path: `test-results/delm-${width}-form-anchor.png` })
  })
}

test('validation, pending, failed delivery, retained values and confirmed success', async ({ page }) => {
  let postCount = 0
  await page.route('**/api/leads', async (route) => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { ok: true, available: true } })
    postCount++
    await new Promise((resolve) => setTimeout(resolve, 500))
    return route.fulfill({ status: postCount === 1 ? 502 : 200, json: postCount === 1 ? { ok: false, message: 'Falha ao enviar. Suas informações foram mantidas.' } : { ok: true, message: 'Informações recebidas. Analisaremos sua operação.' } })
  })
  await page.goto('/#diagnostico')
  const submit = page.getByRole('button', { name: 'Quero analisar minha operação' })
  await expect(submit).toBeEnabled()
  await submit.click()
  await expect(page.getByText('Informe seu nome.', { exact: true })).toBeVisible()
  expect(postCount).toBe(0)
  await fillLead(page)
  await submit.click()
  await expect(page.getByRole('button', { name: 'Enviando informações…' })).toBeDisabled()
  await expect(page.getByRole('alert')).toContainText('Falha ao enviar')
  await expect(page.getByLabel('Empresa', { exact: true })).toHaveValue('Operação Exemplo')
  await expect(page.getByText('Agora entendemos um pouco mais.', { exact: false })).toHaveCount(0)
  await submit.click()
  await expect(page.locator('.form-success')).toContainText('Informações recebidas.')
  expect(postCount).toBe(2)
})

test('entrance, scroll exit and return work without browser errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await expect(page.locator('h1')).toHaveCSS('opacity', '1')
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1')
  await page.evaluate(() => {
    const hero = document.getElementById('inicio')!
    window.scrollTo({ top: hero.offsetTop + hero.offsetHeight * 0.8, behavior: 'instant' })
  })
  await expect.poll(() => page.locator('.hero-copy').evaluate((node) => Number(getComputedStyle(node).opacity))).toBeLessThan(0.6)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1')
  await page.locator('#logistica').scrollIntoViewIfNeeded()
  await expect(page.locator('.logistics-copy')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: 'test-results/delm-logistica-desktop.png' })
  await page.locator('#processo').scrollIntoViewIfNeeded()
  await expect(page.locator('.logistics-copy')).toHaveCSS('opacity', '0')
  await page.locator('#logistica').scrollIntoViewIfNeeded()
  await expect(page.locator('.logistics-copy')).toHaveCSS('opacity', '1')
  await page.locator('#processo').scrollIntoViewIfNeeded()
  await expect(page.locator('.process-step')).toHaveCount(5)
  await page.locator('#diagnostico').scrollIntoViewIfNeeded()
  await expect(page.locator('.form-card')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: 'test-results/delm-formulario-desktop.png' })
  expect(errors).toEqual([])
})

test('mobile form limits, autofill without events, validation and repeated submit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const posts: Record<string, string>[] = []
  await page.route('**/api/leads', async (route) => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { ok: true, available: true } })
    posts.push(route.request().postDataJSON())
    await new Promise((resolve) => setTimeout(resolve, 300))
    return route.fulfill({ json: { ok: true, message: 'Informações recebidas.' } })
  })
  await page.goto('/#diagnostico')
  await expect(page.getByRole('heading', { name: 'Conte um pouco sobre sua empresa.' })).toBeInViewport()
  const inputs = [['name', 'name', '120'], ['corporateEmail', 'email', '254'], ['whatsapp', 'tel', '30'], ['company', 'organization', '160']]
  for (const [id, autocomplete, limit] of inputs) {
    const input = page.locator('#' + id)
    await expect(input).toHaveAttribute('autocomplete', autocomplete!)
    await expect(input).toHaveAttribute('maxlength', limit!)
    await expect(input).toHaveAttribute('required', '')
    await expect(input).toHaveCSS('font-size', '16px')
  }
  await expect(page.locator('#corporateEmail')).toHaveAttribute('autocapitalize', 'none')
  await expect(page.locator('#contact-note')).toHaveAttribute('tabindex', '-1')
  const description = page.locator('#projectDescription')
  await description.fill('')
  await description.focus()
  await page.keyboard.insertText('A'.repeat(2200))
  expect((await description.inputValue()).length).toBe(2000)
  await expect(page.locator('#projectDescription-hint')).toContainText('2.000 / 2.000')
  await fillLead(page)
  await page.locator('#whatsapp').fill('123')
  await page.getByRole('button', { name: 'Quero analisar minha operação' }).click()
  await expect(page.locator('#whatsapp-error')).toContainText('Informe o telefone com DDD.')
  expect(posts).toHaveLength(0)
  // Simulate a password manager/browser that fills the DOM without change events.
  await page.evaluate(() => {
    const values = { name: 'Ana Autopreenchimento', corporateEmail: 'ANA+AUTO@EXAMPLE.COM', whatsapp: '+55 11 99999-9999', company: 'Empresa Automática' }
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
    for (const [id, value] of Object.entries(values)) setter.call(document.getElementById(id), value)
  })
  const form = page.getByRole('form', { name: 'Qualificação da operação' })
  await form.evaluate((node) => {
    const element = node as HTMLFormElement
    element.requestSubmit()
    element.requestSubmit()
  })
  await expect(page.locator('.form-success')).toContainText('Informações recebidas.')
  expect(posts).toHaveLength(1)
  expect(posts[0]).toMatchObject({ name: 'Ana Autopreenchimento', corporateEmail: 'ana+auto@example.com', company: 'Empresa Automática', contact_note: '' })
})
