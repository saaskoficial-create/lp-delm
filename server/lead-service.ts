import { createHash } from 'node:crypto'
import { leadRequestSchema } from '../src/lib/lead-schema.ts'
import type { LeadResponse } from '../src/lib/lead-schema.ts'

type LeadServiceOptions = {
  getWebhookUrl: () => string | undefined
  fetcher?: typeof fetch
  timeoutMs?: number
  now?: () => number
}

export type ServiceResult = { status: number; body: LeadResponse }

export function createLeadService({ getWebhookUrl, fetcher = fetch, timeoutMs = 12_000, now = Date.now }: LeadServiceOptions) {
  const windowMs = 10 * 60_000
  // Warm-instance safeguards; the production edge also needs a distributed rate rule.
  const attempts = new Map<string, { count: number; expires: number }>()
  const deliveries = new Map<string, { result: Promise<ServiceResult>; expires: number }>()
  function configuredWebhook() {
    try {
      const value = getWebhookUrl()?.trim()
      if (!value) return null
      const url = new URL(value)
      return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null
    } catch {
      return null
    }
  }

  return async function handleLeadRequest(method: string, body?: unknown, clientId?: string): Promise<ServiceResult> {
    const webhook = configuredWebhook()
    if (method === 'GET') {
      return { status: 200, body: { ok: true, available: !!webhook, message: webhook ? 'Formulário disponível.' : 'O envio está temporariamente indisponível. Tente novamente mais tarde.' } }
    }
    if (method !== 'POST') return { status: 405, body: { ok: false, message: 'Método não permitido.' } }
    if (!webhook) return { status: 503, body: { ok: false, message: 'O envio está temporariamente indisponível. Tente novamente mais tarde.' } }
    const timestamp = now()
    for (const [key, value] of attempts) if (value.expires <= timestamp) attempts.delete(key)
    for (const [key, value] of deliveries) if (value.expires <= timestamp) deliveries.delete(key)
    if (clientId) {
      const key = createHash('sha256').update(clientId).digest('hex')
      const previous = attempts.get(key)
      if ((previous?.count ?? 0) >= 5 || (!previous && attempts.size >= 5000)) {
        return { status: 429, body: { ok: false, message: 'Muitas tentativas de envio. Aguarde alguns minutos e tente novamente.' } }
      }
      attempts.set(key, { count: (previous?.count ?? 0) + 1, expires: previous?.expires ?? timestamp + windowMs })
    }
    const parsed = leadRequestSchema.safeParse(body)
    if (!parsed.success) {
      return { status: 400, body: { ok: false, message: 'Revise as informações do formulário.', fieldErrors: parsed.error.flatten().fieldErrors } }
    }
    const lead = { ...parsed.data, whatsapp: parsed.data.whatsapp.replace(/\D/g, '') }
    delete lead.contact_note
    const fingerprint = createHash('sha256').update(JSON.stringify(lead)).digest('hex')
    const existing = deliveries.get(fingerprint)
    if (existing) return existing.result
    if (deliveries.size >= 5000) return { status: 429, body: { ok: false, message: 'Muitas solicitações no momento. Tente novamente em alguns minutos.' } }
    const deliver = async (): Promise<ServiceResult> => {
      try {
        const response = await fetcher(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'lp-delm',
            submittedAt: new Date().toISOString(),
            lead,
          }),
          signal: AbortSignal.timeout(timeoutMs),
        })
        if (!response.ok) return { status: 502, body: { ok: false, message: 'Não foi possível enviar agora. Suas informações foram mantidas. Tente novamente.' } }
        return { status: 200, body: { ok: true, message: 'Informações recebidas. Nossa equipe analisará sua operação e entrará em contato caso exista aderência para avançarmos com o diagnóstico.' } }
      } catch {
        return { status: 502, body: { ok: false, message: 'Não foi possível confirmar o envio. Suas informações foram mantidas. Tente novamente em instantes.' } }
      }
    }
    const result = deliver()
    deliveries.set(fingerprint, { result, expires: timestamp + windowMs })
    const response = await result
    if (!response.body.ok) deliveries.delete(fingerprint)
    return response
  }
}
