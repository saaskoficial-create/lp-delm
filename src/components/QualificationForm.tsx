import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight, Check, CheckCircle2, CircleAlert, LoaderCircle, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { employeeRanges, leadLimits, leadSchema, problems, segments, timeframes, type LeadQualificationInput, type LeadResponse } from '@/lib/lead-schema'
import { Eyebrow, Reveal } from './common'

type Availability = 'checking' | 'available' | 'unavailable'

export function QualificationForm() {
  const [availability, setAvailability] = useState<Availability>('checking')
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null)
  const [checkAttempt, setCheckAttempt] = useState(0)
  const trap = useRef<HTMLInputElement>(null)
  const sending = useRef(false)
  const successMessage = useRef<HTMLDivElement>(null)
  const [invalidField, setInvalidField] = useState<keyof LeadQualificationInput | null>(null)
  const { register, control, handleSubmit, setValue, setError, setFocus, formState: { errors, isSubmitting } } = useForm<LeadQualificationInput>({ resolver: zodResolver(leadSchema), mode: 'onBlur' })
  const description = useWatch({ control, name: 'projectDescription', defaultValue: '' })

  useEffect(() => {
    if (isSubmitting || !invalidField) return
    // Fields are disabled during delivery; wait until they can receive focus again.
    setFocus(invalidField)
    document.getElementById(invalidField)?.scrollIntoView({ behavior: 'instant', block: 'center' })
    setInvalidField(null)
  }, [invalidField, isSubmitting, setFocus])

  useEffect(() => {
    if (!feedback?.success) return
    // Replacing the tall form can leave mobile visitors below the confirmation.
    successMessage.current?.focus({ preventScroll: true })
    document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [feedback])

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
    if (availability !== 'available' || sending.current) return
    sending.current = true
    setFeedback(null)
    setInvalidField(null)
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, contact_note: trap.current?.value ?? '' }), signal: AbortSignal.timeout(16_000) })
      const data: LeadResponse = await response.json()
      if (!response.ok || !data.ok) {
        if (response.status === 503) setAvailability('unavailable')
        let firstInvalid: keyof LeadQualificationInput | undefined
        for (const [field, messages] of Object.entries(data.fieldErrors ?? {})) {
          if (field in leadSchema.shape) setError(field as keyof LeadQualificationInput, { message: messages[0] })
          if (!firstInvalid && field in leadSchema.shape) firstInvalid = field as keyof LeadQualificationInput
        }
        if (firstInvalid) setInvalidField(firstInvalid)
        throw new Error(data.message || 'Não foi possível enviar agora. Tente novamente.')
      }
      setFeedback({ success: true, message: data.message })
    } catch (error) {
      setFeedback({ success: false, message: error instanceof Error && error.name !== 'TimeoutError' && error.name !== 'TypeError' ? error.message : 'Não foi possível confirmar o envio. Suas informações foram mantidas. Tente novamente em instantes.' })
    } finally { sending.current = false }
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

  return <section className="section form-section" aria-labelledby="form-title">
    <div className="container form-layout">
      <Reveal className="form-intro"><Eyebrow light>Vamos entender sua operação</Eyebrow><h2 id="form-title">Antes de falar sobre software, queremos entender <span>sua operação.</span></h2><p>Responda algumas perguntas sobre o cenário atual da sua empresa. Isso nos ajuda a entender se existe aderência e qual tipo de solução pode fazer sentido.</p><div className="form-next"><span className="dark-label">O que acontece depois</span><div><span>01</span><p>Você conta como funciona hoje.</p></div><div><span>02</span><p>Analisamos o cenário e a aderência.</p></div><div><span>03</span><p>Se fizer sentido, avançamos com o diagnóstico.</p></div></div><div className="form-trust"><LockKeyhole size={16} aria-hidden="true" /><span>Informações usadas para analisar sua solicitação e entrar em contato.</span></div></Reveal>
      <Reveal id="diagnostico" className="form-card section-anchor">
        {feedback?.success ? <div className="form-success" ref={successMessage} tabIndex={-1} role="status"><CheckCircle2 size={47} strokeWidth={1.5} aria-hidden="true" /><span className="form-kicker">PRÓXIMO PASSO</span><h3>Agora entendemos<br />um pouco mais.</h3><p>{feedback.message}</p><a href="#inicio">Voltar ao início<ArrowUpRight size={17} aria-hidden="true" /></a></div> : <>
          <div className="form-card-heading"><div><span className="form-kicker">COMECE PELO SEU GARGALO</span><h3>Conte um pouco sobre sua empresa.</h3></div><span className="form-heading-icon"><ArrowUpRight size={24} /></span></div>
          <form autoComplete="on" aria-busy={isSubmitting} noValidate onSubmit={(event) => {
            // Read DOM values at submission too: some browser autofill providers omit input events.
            const current = new FormData(event.currentTarget)
            for (const field of Object.keys(leadSchema.shape) as (keyof LeadQualificationInput)[]) {
              const value = current.get(field)
              if (typeof value === 'string') setValue(field, value as LeadQualificationInput[typeof field])
            }
            void handleSubmit(submit)(event)
          }} aria-label="Qualificação da operação"><noscript><p className="form-alert">Ative o JavaScript do navegador para preencher e enviar este formulário.</p></noscript>
            <p className="form-required">Todos os campos são obrigatórios.</p>
            <fieldset disabled={isSubmitting} className="form-fields">
              <legend className="sr-only">Informações da empresa e do projeto</legend>
              <div className="form-trap" aria-hidden="true"><label htmlFor="contact-note">Deixe este campo vazio</label><input id="contact-note" name="contact_note" ref={trap} autoComplete="off" tabIndex={-1} /></div>
              {inputFields.map((field) => <div className="form-field" key={field.name}><Label htmlFor={field.name}>{field.label}</Label><Input id={field.name} type={field.type} required minLength={field.type === 'text' ? 2 : undefined} spellCheck={false} autoCapitalize={field.type === 'email' || field.type === 'tel' ? 'none' : 'words'} autoCorrect={field.type === 'email' || field.type === 'tel' ? 'off' : undefined} inputMode={field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : undefined} placeholder={field.placeholder} autoComplete={field.autocomplete} maxLength={leadLimits[field.name]} aria-invalid={!!errors[field.name]} aria-describedby={`${field.name}-hint${errors[field.name] ? ` ${field.name}-error` : ''}`} {...register(field.name)} /><span id={`${field.name}-hint`} className="field-hint">{field.name === 'whatsapp' ? 'Inclua o DDD. Para outro país, inclua o código internacional.' : `Até ${leadLimits[field.name]} caracteres.`}</span>{errors[field.name] && <p id={`${field.name}-error`} className="field-error" aria-live="polite">{errors[field.name]?.message}</p>}</div>)}
              {selectFields.map((field) => <div key={field.name} className={`form-field ${field.wide ? 'field-wide' : ''}`}><Label htmlFor={field.name}>{field.label}</Label><NativeSelect id={field.name} required aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} defaultValue="" {...register(field.name)}><NativeSelectOption value="" disabled>{field.placeholder}</NativeSelectOption>{field.options.map((option) => <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>)}</NativeSelect>{errors[field.name] && <p id={`${field.name}-error`} className="field-error" aria-live="polite">{errors[field.name]?.message}</p>}</div>)}
              <div className="form-field field-wide"><Label htmlFor="projectDescription">O que você gostaria de melhorar ou desenvolver?</Label><Textarea id="projectDescription" rows={4} required minLength={10} maxLength={leadLimits.projectDescription} autoComplete="off" placeholder="Ex.: nosso ERP não conversa com o WMS e precisamos atualizar informações manualmente." aria-invalid={!!errors.projectDescription} aria-describedby={`projectDescription-hint${errors.projectDescription ? ' projectDescription-error' : ''}`} {...register('projectDescription')} /><div className="field-hint description-meta" id="projectDescription-hint"><span>Descreva seu objetivo em 10 a 2.000 caracteres.</span><span>{description.length.toLocaleString('pt-BR')} / 2.000</span></div>{errors.projectDescription && <p id="projectDescription-error" className="field-error" aria-live="polite">{errors.projectDescription.message}</p>}</div>
              <div className="form-field field-wide"><Label htmlFor="timeframe">Qual é o momento do projeto?</Label><NativeSelect id="timeframe" required defaultValue="" aria-invalid={!!errors.timeframe} aria-describedby={errors.timeframe ? 'timeframe-error' : undefined} {...register('timeframe')}><NativeSelectOption value="" disabled>Selecione o momento</NativeSelectOption>{timeframes.map((option) => <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>)}</NativeSelect>{errors.timeframe && <p id="timeframe-error" className="field-error" aria-live="polite">{errors.timeframe.message}</p>}</div>
            </fieldset>
            {availability === 'unavailable' && <div className="form-unavailable" role="status"><CircleAlert size={17} /><div><p>O envio está temporariamente indisponível. Tente novamente mais tarde.</p><button type="button" onClick={() => { setAvailability('checking'); setCheckAttempt((value) => value + 1) }}>Verificar novamente</button></div></div>}
            {feedback && !feedback.success && <div className="form-error" role="alert"><CircleAlert size={18} /><p>{feedback.message}</p></div>}
            <Button type="submit" className="form-submit cta-button" disabled={availability !== 'available' || isSubmitting}>{isSubmitting ? <><LoaderCircle className="animate-spin" size={18} aria-hidden="true" />Enviando informações…</> : availability === 'checking' ? <><LoaderCircle className="animate-spin" size={18} aria-hidden="true" />Verificando disponibilidade…</> : <>Quero analisar minha operação<ArrowUpRight size={19} aria-hidden="true" /></>}</Button>
            <p className="form-note"><Check size={13} />Após o envio, nossa equipe analisará as informações e entrará em contato caso exista aderência para avançarmos com o diagnóstico.</p>
          </form>
        </>}
      </Reveal>
    </div>
  </section>
}
