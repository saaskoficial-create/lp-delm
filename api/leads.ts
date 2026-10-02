import type { IncomingMessage, ServerResponse } from 'node:http'
import { createLeadService } from '../server/lead-service.ts'
import { handleNodeRequest } from '../server/node-handler.ts'

const service = createLeadService({ getWebhookUrl: () => process.env.LEAD_WEBHOOK_URL })

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  await handleNodeRequest(req, res, service)
}
