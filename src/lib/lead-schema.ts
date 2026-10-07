import { z } from 'zod'

export const segments = ['Transportadora', 'Operador logístico', 'Distribuidora / atacadista', 'Prestadora de serviços B2B', 'Indústria', 'Outra'] as const
export const employeeRanges = ['Até 10', '11 a 20', '21 a 50', '51 a 100', '101 a 250', '251 a 500', 'Mais de 500'] as const
export const problems = [
  'Usamos muitas planilhas para complementar nossos sistemas',
  'Nossos sistemas não conversam entre si',
  'O software atual não acompanha nossa operação',
  'Temos muitos processos manuais',
  'Precisamos criar um novo sistema ou plataforma',
  'Precisamos automatizar um processo específico',
  'Outro',
] as const
export const timeframes = ['Precisamos resolver agora', 'Nos próximos 3 meses', 'Entre 3 e 6 meses', 'Ainda estamos estudando'] as const

export const leadLimits = { name: 120, corporateEmail: 254, whatsapp: 30, company: 160, projectDescription: 2000 } as const

// Check the original length before trimming, including requests that bypass HTML.
function textField(max: number, multiline = false) {
  return z.string().max(max, `Use até ${max.toLocaleString('pt-BR')} caracteres.`).trim().refine(
    (value) => !Array.from(value).some((character) => {
      const code = character.charCodeAt(0)
      return code < 32 && !(multiline && [9, 10, 13].includes(code)) || code === 127
    }),
    'Remova os caracteres inválidos deste campo.',
  )
}

export const leadSchema = z.object({
  name: textField(leadLimits.name).refine((value) => value.length >= 2, 'Informe seu nome.'),
  corporateEmail: textField(leadLimits.corporateEmail).refine((value) => z.string().email().safeParse(value).success, 'Informe um e-mail válido.').transform((value) => value.toLowerCase()),
  whatsapp: textField(leadLimits.whatsapp).refine((value) => {
    const digits = value.replace(/\D/g, '')
    return /^[+\d\s().-]+$/.test(value) && digits.length >= 10 && digits.length <= 15
  }, 'Informe o telefone com DDD.'),
  company: textField(leadLimits.company).refine((value) => value.length >= 2, 'Informe o nome da empresa.'),
  segment: z.enum(segments, { errorMap: () => ({ message: 'Selecione seu segmento.' }) }),
  employeeRange: z.enum(employeeRanges, { errorMap: () => ({ message: 'Selecione o tamanho da equipe.' }) }),
  mainProblem: z.enum(problems, { errorMap: () => ({ message: 'Selecione o cenário da operação.' }) }),
  projectDescription: textField(leadLimits.projectDescription, true).refine((value) => value.length >= 10, 'Conte um pouco mais sobre o que precisa melhorar.'),
  timeframe: z.enum(timeframes, { errorMap: () => ({ message: 'Selecione o momento do projeto.' }) }),
}).strict()

// A hidden field traps basic automated submissions without interfering with autofill.
export const leadRequestSchema = leadSchema.extend({ contact_note: z.string().max(0).optional() })

export type LeadQualificationInput = z.infer<typeof leadSchema>
export type LeadResponse = { ok: boolean; message: string; available?: boolean; fieldErrors?: Record<string, string[]> }
