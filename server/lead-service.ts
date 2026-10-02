import { leadSchema } from '../src/lib/lead-schema.ts'
import type { LeadResponse } from '../src/lib/lead-schema.ts'

type LeadServiceOptions = {
  getWebhookUrl: () => string | undefined
  fetcher?: typeof fetch
  timeoutMs?: number
}

export type ServiceResult = { status: number; body: LeadResponse }

export function createLeadService({ getWebhookUrl, fetcher = fetch, timeoutMs = 12_000 }: LeadServiceOptions) {
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

  return async function handleLeadRequest(method: string, body?: unknown): Promise<ServiceResult> {
    const webhook = configuredWebhook()
    if (method === 'GET') {
      return { status: 200, body: { ok: true, available: !!webhook, message: webhook ? 'Formulário disponível.' : 'O envio está temporariamente indisponível. Tente novamente mais tarde.' } }
    }
    if (method !== 'POST') return { status: 405, body: { ok: false, message: 'Método não permitido.' } }
    if (!webhook) return { status: 503, body: { ok: false, message: 'O envio está temporariamente indisponível. Tente novamente mais tarde.' } }
    const parsed = leadSchema.safeParse(body)
    if (!parsed.success) {
      return { status: 400, body: { ok: false, message: 'Revise as informações do formulário.', fieldErrors: parsed.error.flatten().fieldErrors } }
    }
    try {
      const response = await fetcher(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'lp-delm',
          submittedAt: new Date().toISOString(),
          lead: { ...parsed.data, whatsapp: parsed.data.whatsapp.replace(/\D/g, '') },
        }),
        signal: AbortSignal.timeout(timeoutMs),
      })
      if (!response.ok) return { status: 502, body: { ok: false, message: 'Não foi possível enviar agora. Suas informações foram mantidas. Tente novamente.' } }
      return { status: 200, body: { ok: true, message: 'Informações recebidas. Nossa equipe analisará sua operação e entrará em contato caso exista aderência para avançarmos com o diagnóstico.' } }
    } catch {
      return { status: 502, body: { ok: false, message: 'Não foi possível confirmar o envio. Suas informações foram mantidas. Tente novamente em instantes.' } }
    }
  }
}
