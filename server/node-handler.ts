import type { IncomingMessage, ServerResponse } from 'node:http'
import type { ServiceResult } from './lead-service.ts'

type RequestWithBody = IncomingMessage & { body?: unknown }
type LeadService = (method: string, body?: unknown) => Promise<ServiceResult>
const maxBodyBytes = 16_384

export async function handleNodeRequest(req: RequestWithBody, res: ServerResponse, service: LeadService) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Allow', 'GET, POST')
  try {
    let body: unknown = req.body
    if (req.method === 'POST') {
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
    const result = await service(req.method ?? 'GET', body)
    res.statusCode = result.status
    res.end(JSON.stringify(result.body))
  } catch {
    res.statusCode = 400
    res.end(JSON.stringify({ ok: false, message: 'Não foi possível ler o formulário. Revise e tente novamente.' }))
  }
}
