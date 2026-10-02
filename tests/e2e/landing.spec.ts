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
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Se sua equipe criou planilhas para fazer o sistema funcionar, o sistema já falhou.')
    await expect(page.locator('main > section')).toHaveCount(10)
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }))
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport)
    await expect(page.getByRole('button', { name: 'Quero analisar minha operação' })).toBeDisabled()
    await expect(page.getByText('O envio está temporariamente indisponível.', { exact: false })).toBeVisible()
    await page.screenshot({ path: `test-results/delm-${width}-hero.png` })
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/delm-${width}-full.png`, fullPage: true })
    if (width < 850) {
      await page.getByRole('button', { name: 'Abrir menu' }).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await page.getByRole('navigation', { name: 'Navegação mobile' }).getByRole('link', { name: 'Mapear meu gargalo' }).click()
    } else {
      await page.locator('.hero-copy').getByRole('link', { name: 'Quero mapear meu gargalo' }).click()
    }
    await expect(page).toHaveURL(/#diagnostico$/)
    await expect(page.getByRole('heading', { name: 'Antes de falar sobre software' })).toBeInViewport()
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
  await expect(page.getByRole('button', { name: 'Enviando informações...' })).toBeDisabled()
  await expect(page.getByRole('alert')).toContainText('Falha ao enviar')
  await expect(page.getByLabel('Empresa', { exact: true })).toHaveValue('Operação Exemplo')
  await expect(page.getByText('Agora entendemos um pouco mais.', { exact: false })).toHaveCount(0)
  await submit.click()
  await expect(page.locator('.form-success')).toContainText('Informações recebidas.')
  expect(postCount).toBe(2)
})

test('normal animation mode renders without browser errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1')
  await page.locator('#logistica').scrollIntoViewIfNeeded()
  await expect(page.locator('.logistics-copy')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: 'test-results/delm-logistica-desktop.png' })
  await page.locator('#processo').scrollIntoViewIfNeeded()
  await expect(page.locator('.process-step')).toHaveCount(5)
  await page.locator('#diagnostico').scrollIntoViewIfNeeded()
  await expect(page.locator('.form-card')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: 'test-results/delm-formulario-desktop.png' })
  expect(errors).toEqual([])
})
