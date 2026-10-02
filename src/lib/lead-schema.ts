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

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(120, 'Use até 120 caracteres.'),
  corporateEmail: z.string().trim().email('Informe um e-mail válido.').max(254),
  whatsapp: z.string().trim().max(30).refine((value) => {
    const digits = value.replace(/\D/g, '')
    return /^[+\d\s().-]+$/.test(value) && digits.length >= 10 && digits.length <= 15
  }, 'Informe o telefone com DDD.'),
  company: z.string().trim().min(2, 'Informe o nome da empresa.').max(160),
  segment: z.enum(segments, { errorMap: () => ({ message: 'Selecione seu segmento.' }) }),
  employeeRange: z.enum(employeeRanges, { errorMap: () => ({ message: 'Selecione o tamanho da equipe.' }) }),
  mainProblem: z.enum(problems, { errorMap: () => ({ message: 'Selecione o cenário da operação.' }) }),
  projectDescription: z.string().trim().min(10, 'Conte um pouco mais sobre o que precisa melhorar.').max(2000, 'Use até 2.000 caracteres.'),
  timeframe: z.enum(timeframes, { errorMap: () => ({ message: 'Selecione o momento do projeto.' }) }),
}).strict()

export type LeadQualificationInput = z.infer<typeof leadSchema>
export type LeadResponse = { ok: boolean; message: string; available?: boolean; fieldErrors?: Record<string, string[]> }
