import { createServer } from 'node:http'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createLeadService } from '../server/lead-service'
import { handleNodeRequest } from '../server/node-handler'

const validLead = {
  name: '  Ana Oliveira  ',
  corporateEmail: 'ana@example.com',
  whatsapp: '(11) 99999-9999',
  company: 'Operação Exemplo',
  segment: 'Operador logístico',
  employeeRange: '21 a 50',
  mainProblem: 'Nossos sistemas não conversam entre si',
  projectDescription: 'Precisamos integrar nosso ERP ao WMS para reduzir atualizações manuais.',
  timeframe: 'Nos próximos 3 meses',
}

afterEach(() => vi.restoreAllMocks())

describe('Lead endpoint contract', () => {
  it('reports unavailable and never accepts a lead without a webhook', async () => {
    const fetcher = vi.fn()
    const service = createLeadService({ getWebhookUrl: () => undefined, fetcher })
    expect((await service('GET')).body.available).toBe(false)
    expect((await service('POST', validLead)).status).toBe(503)
    expect(fetcher).not.toHaveBeenCalled()
  })

  it.each(['not a url', 'file:///private', ''])('rejects invalid server configuration: %s', async (url) => {
    const service = createLeadService({ getWebhookUrl: () => url })
    expect((await service('GET')).body.available).toBe(false)
  })

  it('does not expose the webhook through the availability endpoint', async () => {
    const service = createLeadService({ getWebhookUrl: () => 'https://example.com/private-webhook' })
    const result = await service('GET')
    expect(result.body.available).toBe(true)
    expect(JSON.stringify(result)).not.toContain('private-webhook')
  })

  it('rejects incomplete and unexpected fields before forwarding', async () => {
    const fetcher = vi.fn()
    const service = createLeadService({ getWebhookUrl: () => 'https://example.com/hook', fetcher })
    const invalid = await service('POST', { ...validLead, corporateEmail: 'invalid', segment: 'Not an option' })
    expect(invalid.status).toBe(400)
    expect(invalid.body.fieldErrors?.corporateEmail).toBeDefined()
    expect((await service('POST', { ...validLead, arbitrary: 'injected' })).status).toBe(400)
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('only confirms after the destination accepts all nine fields', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }))
    const service = createLeadService({ getWebhookUrl: () => 'https://example.com/hook', fetcher })
    const result = await service('POST', validLead)
    expect(result.status).toBe(200)
    expect(result.body.ok).toBe(true)
    const options = fetcher.mock.calls[0]?.[1]
    const payload = JSON.parse(String(options?.body))
    expect(payload.lead).toEqual({ ...validLead, name: 'Ana Oliveira', whatsapp: '11999999999' })
    expect(payload.source).toBe('lp-delm')
    expect(new Date(payload.submittedAt).toISOString()).toBe(payload.submittedAt)
  })

  it('does not claim success if the destination rejects delivery', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 500 }))
    const service = createLeadService({ getWebhookUrl: () => 'https://example.com/hook', fetcher })
    const result = await service('POST', validLead)
    expect(result.status).toBe(502)
    expect(result.body.ok).toBe(false)
  })

  it('handles timeout/network failure without confirming delivery', async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new DOMException('Timeout', 'TimeoutError'))
    const service = createLeadService({ getWebhookUrl: () => 'https://example.com/hook', fetcher })
    expect((await service('POST', validLead)).body.ok).toBe(false)
    expect((await service('DELETE')).status).toBe(405)
  })

  it('delivers through real HTTP adapters and rejects malformed or oversized requests', async () => {
    let received: unknown
    const destination = createServer(async (req, res) => {
      const chunks: Buffer[] = []
      for await (const chunk of req) chunks.push(Buffer.from(chunk))
      received = JSON.parse(Buffer.concat(chunks).toString())
      res.writeHead(204).end()
    })
    await new Promise<void>((resolve) => destination.listen(0, '127.0.0.1', resolve))
    const destinationAddress = destination.address()
    if (!destinationAddress || typeof destinationAddress === 'string') throw new Error('Missing destination address')
    const service = createLeadService({ getWebhookUrl: () => `http://127.0.0.1:${destinationAddress.port}/hook` })
    const api = createServer((req, res) => { void handleNodeRequest(req, res, service) })
    await new Promise<void>((resolve) => api.listen(0, '127.0.0.1', resolve))
    const address = api.address()
    if (!address || typeof address === 'string') throw new Error('Missing API address')
    const url = `http://127.0.0.1:${address.port}/api/leads`
    try {
      const response = await fetch(url, { method: 'POST', body: JSON.stringify(validLead), headers: { 'Content-Type': 'application/json' } })
      expect(response.status).toBe(200)
      expect((await response.json()).ok).toBe(true)
      expect(received).toMatchObject({ source: 'lp-delm', lead: { company: validLead.company } })
      const invalid = await fetch(url, { method: 'POST', body: '{broken', headers: { 'Content-Type': 'application/json' } })
      expect(invalid.status).toBe(400)
      const oversized = await fetch(url, { method: 'POST', body: 'x'.repeat(17000), headers: { 'Content-Type': 'application/json' } })
      expect(oversized.status).toBe(413)
      expect((await fetch(url, { method: 'POST', body: JSON.stringify(validLead) })).status).toBe(415)
      expect((await fetch(url, { method: 'POST', body: JSON.stringify(validLead), headers: { 'Content-Type': 'application/json', Origin: 'https://other.example' } })).status).toBe(403)
      expect((await fetch(url, { method: 'POST', body: JSON.stringify(validLead), headers: { 'Content-Type': 'application/json', 'Sec-Fetch-Site': 'cross-site' } })).status).toBe(403)
    } finally {
      await Promise.all([new Promise<void>((resolve) => api.close(() => resolve())), new Promise<void>((resolve) => destination.close(() => resolve()))])
    }
  })

  it.each([
    { name: 'A'.repeat(121) },
    { name: ' '.repeat(121) + 'Ana' },
    { corporateEmail: 'a'.repeat(254) + '@example.com' },
    { whatsapp: '1'.repeat(31) },
    { company: 'A'.repeat(161) },
    { projectDescription: 'A'.repeat(2001) },
    { name: 'Ana\u0000Oliveira' },
    { contact_note: 'spam link' },
  ])('rejects excessive or automated input without forwarding: %j', async (override) => {
    const fetcher = vi.fn()
    const service = createLeadService({ getWebhookUrl: () => 'https://example.com/hook', fetcher })
    expect((await service('POST', { ...validLead, ...override })).status).toBe(400)
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('coalesces simultaneous duplicate submissions and allows a failed delivery to be retried', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(null, { status: 502 })).mockResolvedValue(new Response(null, { status: 204 }))
    const service = createLeadService({ getWebhookUrl: () => 'https://example.com/hook', fetcher })
    expect((await service('POST', validLead)).status).toBe(502)
    const responses = await Promise.all([service('POST', validLead), service('POST', { ...validLead, contact_note: '' })])
    expect(responses.map((response) => response.status)).toEqual([200, 200])
    expect((await service('POST', validLead)).status).toBe(200)
    expect(fetcher).toHaveBeenCalledTimes(2)
    expect(JSON.parse(String(fetcher.mock.calls[1]?.[1]?.body)).lead).not.toHaveProperty('contact_note')
  })

  it('limits attempts by client, isolates other clients and expires the limit', async () => {
    let timestamp = 0
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }))
    const service = createLeadService({ getWebhookUrl: () => 'https://example.com/hook', fetcher, now: () => timestamp })
    for (let i = 0; i < 5; i++) expect((await service('POST', {}, 'client-one')).status).toBe(400)
    expect((await service('POST', validLead, 'client-one')).status).toBe(429)
    expect((await service('POST', validLead, 'client-two')).status).toBe(200)
    timestamp = 600_001
    expect((await service('POST', validLead, 'client-one')).status).toBe(200)
  })
})
