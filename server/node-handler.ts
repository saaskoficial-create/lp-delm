import type { IncomingMessage, ServerResponse } from 'node:http'
import type { ServiceResult } from './lead-service.ts'

type RequestWithBody = IncomingMessage & { body?: unknown }
type LeadService = (method: string, body?: unknown, clientId?: string) => Promise<ServiceResult>
const maxBodyBytes = 16_384

export async function handleNodeRequest(req: RequestWithBody, res: ServerResponse, service: LeadService) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Allow', 'GET, POST')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  try {
    let body: unknown = req.body
    if (req.method === 'POST') {
      const deny = (status: number, message: string) => {
        res.statusCode = status
        res.end(JSON.stringify({ ok: false, message }))
      }
      const origin = req.headers.origin
      if (req.headers['sec-fetch-site'] === 'cross-site') {
        deny(403, 'Envie o formulário pela página da DELM.')
        return
      }
      if (origin) {
        let allowed = false
        try {
          const url = new URL(origin)
          allowed = ['https:', 'http:'].includes(url.protocol) && url.host === req.headers.host
        } catch { /* Invalid origins must not reach the destination. */ }
        if (!allowed) {
          deny(403, 'Envie o formulário pela página da DELM.')
          return
        }
      }
      const contentLength = Number(req.headers['content-length'] ?? 0)
      if (!Number.isFinite(contentLength) || contentLength > maxBodyBytes) {
        deny(413, 'O formulário ultrapassou o tamanho permitido.')
        return
      }
      if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] ?? '')) {
        deny(415, 'Formato de envio inválido. Use o formulário da DELM.')
        return
      }
      if (body === undefined) {
        const chunks: Buffer[] = []
        let bytes = 0
        for await (const chunk of req) {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
          bytes += buffer.length
          if (bytes > maxBodyBytes) {
            res.statusCode = 413
            res.end(JSON.stringify({ ok: false, message: 'O formulário ultrapassou o tamanho permitido.' }))
            return
          }
          chunks.push(buffer)
        }
        body = Buffer.concat(chunks).toString('utf8')
      }
      if (Buffer.byteLength(typeof body === 'string' ? body : JSON.stringify(body ?? {})) > maxBodyBytes) {
        res.statusCode = 413
        res.end(JSON.stringify({ ok: false, message: 'O formulário ultrapassou o tamanho permitido.' }))
        return
      }
      if (typeof body === 'string') body = JSON.parse(body)
    }
    // Vercel overwrites this header at its edge; local development trusts the socket only.
    const forwarded = process.env.VERCEL === '1' ? req.headers['x-vercel-forwarded-for'] ?? req.headers['x-forwarded-for'] : undefined
    const clientId = typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() || req.socket.remoteAddress : req.socket.remoteAddress
    const result = await service(req.method ?? 'GET', body, clientId)
    if (result.status === 429) res.setHeader('Retry-After', '600')
    res.statusCode = result.status
    res.end(JSON.stringify(result.body))
  } catch {
    res.statusCode = 400
    res.end(JSON.stringify({ ok: false, message: 'Não foi possível ler o formulário. Revise e tente novamente.' }))
  }
}
