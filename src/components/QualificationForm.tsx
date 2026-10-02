import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight, Check, CheckCircle2, CircleAlert, LoaderCircle, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { employeeRanges, leadSchema, problems, segments, timeframes, type LeadQualificationInput, type LeadResponse } from '@/lib/lead-schema'
import { Eyebrow, Reveal } from './common'

type Availability = 'checking' | 'available' | 'unavailable'

export function QualificationForm() {
  const [availability, setAvailability] = useState<Availability>('checking')
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null)
  const [checkAttempt, setCheckAttempt] = useState(0)
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LeadQualificationInput>({ resolver: zodResolver(leadSchema), mode: 'onBlur' })

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 8_000)
    async function checkAvailability() {
      try {
        const response = await fetch('/api/leads', { signal: controller.signal })
        const data: LeadResponse = await response.json()
        if (!response.ok || !data.ok) throw new Error('Unavailable')
        if (active) setAvailability(data.available ? 'available' : 'unavailable')
      } catch {
        if (active) setAvailability('unavailable')
      } finally {
        window.clearTimeout(timeout)
      }
    }
    void checkAvailability()
    return () => { active = false; window.clearTimeout(timeout); controller.abort() }
  }, [checkAttempt])

  async function submit(values: LeadQualificationInput) {
    setFeedback(null)
    if (availability !== 'available') return
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values), signal: AbortSignal.timeout(16_000) })
      const data: LeadResponse = await response.json()
      if (!response.ok || !data.ok) {
        if (response.status === 503) setAvailability('unavailable')
        for (const [field, messages] of Object.entries(data.fieldErrors ?? {})) {
          if (field in leadSchema.shape) setError(field as keyof LeadQualificationInput, { message: messages[0] })
        }
        throw new Error(data.message || 'Não foi possível enviar agora. Tente novamente.')
      }
      setFeedback({ success: true, message: data.message })
    } catch (error) {
      setFeedback({ success: false, message: error instanceof Error && error.name !== 'TimeoutError' && error.name !== 'TypeError' ? error.message : 'Não foi possível confirmar o envio. Suas informações foram mantidas. Tente novamente em instantes.' })
    }
  }

  const inputFields = [
    { name: 'name', label: 'Nome', placeholder: 'Seu nome', autocomplete: 'name', type: 'text' },
    { name: 'corporateEmail', label: 'E-mail corporativo', placeholder: 'voce@empresa.com.br', autocomplete: 'email', type: 'email' },
    { name: 'whatsapp', label: 'WhatsApp', placeholder: '(11) 99999-9999', autocomplete: 'tel', type: 'tel' },
    { name: 'company', label: 'Empresa', placeholder: 'Nome da empresa', autocomplete: 'organization', type: 'text' },
  ] as const
  const selectFields = [
    { name: 'segment', label: 'Qual é o seu segmento?', placeholder: 'Selecione o segmento', options: segments, wide: false },
    { name: 'employeeRange', label: 'Quantas pessoas trabalham na empresa?', placeholder: 'Selecione o tamanho', options: employeeRanges, wide: false },
    { name: 'mainProblem', label: 'Hoje, qual situação mais se aproxima da sua operação?', placeholder: 'Selecione o cenário atual', options: problems, wide: true },
  ] as const

  return <section id="diagnostico" className="section form-section section-anchor" aria-labelledby="form-title">
    <div className="container form-layout">
      <Reveal className="form-intro"><Eyebrow light>VAMOS ENTENDER SUA OPERAÇÃO</Eyebrow><h2 id="form-title">Antes de falar sobre software, queremos entender <span>sua operação.</span></h2><p>Responda algumas perguntas sobre o cenário atual da sua empresa. Isso nos ajuda a entender se existe aderência e qual tipo de solução pode fazer sentido.</p><div className="form-next"><span className="dark-label">O QUE ACONTECE DEPOIS</span><div><span>01</span><p>Você conta como funciona hoje.</p></div><div><span>02</span><p>Analisamos o cenário e a aderência.</p></div><div><span>03</span><p>Se fizer sentido, avançamos com o diagnóstico.</p></div></div><div className="form-trust"><LockKeyhole size={16} /><span>Informações usadas para analisar sua solicitação e entrar em contato.</span></div></Reveal>
      <Reveal className="form-card">
        {feedback?.success ? <div className="form-success" role="status"><CheckCircle2 size={47} strokeWidth={1.5} /><span className="form-kicker">PRÓXIMO PASSO</span><h3>Agora entendemos<br />um pouco mais.</h3><p>{feedback.message}</p><a href="#inicio">Voltar ao início<ArrowUpRight size={17} /></a></div> : <>
          <div className="form-card-heading"><div><span className="form-kicker">COMECE PELO SEU GARGALO</span><h3>Conte um pouco sobre sua empresa.</h3></div><span className="form-heading-icon"><ArrowUpRight size={24} /></span></div>
          <form noValidate onSubmit={handleSubmit(submit)} aria-label="Qualificação da operação">
            <fieldset disabled={isSubmitting} className="form-fields">
              <legend className="sr-only">Informações da empresa e do projeto</legend>
              {inputFields.map((field) => <div className="form-field" key={field.name}><Label htmlFor={field.name}>{field.label}</Label><Input id={field.name} type={field.type} placeholder={field.placeholder} autoComplete={field.autocomplete} maxLength={field.name === 'name' ? 120 : field.name === 'corporateEmail' ? 254 : field.name === 'whatsapp' ? 30 : 160} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} {...register(field.name)} />{errors[field.name] && <p id={`${field.name}-error`} className="field-error">{errors[field.name]?.message}</p>}</div>)}
              {selectFields.map((field) => <div key={field.name} className={`form-field ${field.wide ? 'field-wide' : ''}`}><Label htmlFor={field.name}>{field.label}</Label><NativeSelect id={field.name} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} defaultValue="" {...register(field.name)}><NativeSelectOption value="" disabled>{field.placeholder}</NativeSelectOption>{field.options.map((option) => <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>)}</NativeSelect>{errors[field.name] && <p id={`${field.name}-error`} className="field-error">{errors[field.name]?.message}</p>}</div>)}
              <div className="form-field field-wide"><Label htmlFor="projectDescription">O que você gostaria de melhorar ou desenvolver?</Label><Textarea id="projectDescription" rows={4} maxLength={2000} placeholder="Ex.: nosso ERP não conversa com o WMS e precisamos atualizar informações manualmente." aria-invalid={!!errors.projectDescription} aria-describedby={errors.projectDescription ? 'projectDescription-error' : undefined} {...register('projectDescription')} />{errors.projectDescription && <p id="projectDescription-error" className="field-error">{errors.projectDescription.message}</p>}</div>
              <div className="form-field field-wide"><Label htmlFor="timeframe">Qual é o momento do projeto?</Label><NativeSelect id="timeframe" defaultValue="" aria-invalid={!!errors.timeframe} aria-describedby={errors.timeframe ? 'timeframe-error' : undefined} {...register('timeframe')}><NativeSelectOption value="" disabled>Selecione o momento</NativeSelectOption>{timeframes.map((option) => <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>)}</NativeSelect>{errors.timeframe && <p id="timeframe-error" className="field-error">{errors.timeframe.message}</p>}</div>
            </fieldset>
            {availability === 'unavailable' && <div className="form-unavailable" role="status"><CircleAlert size={17} /><div><p>O envio está temporariamente indisponível. Tente novamente mais tarde.</p><button type="button" onClick={() => { setAvailability('checking'); setCheckAttempt((value) => value + 1) }}>Verificar novamente</button></div></div>}
            {feedback && !feedback.success && <div className="form-error" role="alert"><CircleAlert size={18} /><p>{feedback.message}</p></div>}
            <Button type="submit" className="form-submit cta-button" disabled={availability !== 'available' || isSubmitting}>{isSubmitting ? <><LoaderCircle className="animate-spin" size={18} />Enviando informações...</> : availability === 'checking' ? <><LoaderCircle className="animate-spin" size={18} />Verificando disponibilidade...</> : <>Quero analisar minha operação<ArrowUpRight size={19} /></>}</Button>
            <p className="form-note"><Check size={13} />Após o envio, nossa equipe analisará as informações e entrará em contato caso exista aderência para avançarmos com o diagnóstico.</p>
          </form>
        </>}
      </Reveal>
    </div>
  </section>
}
