import { ArrowUpRight } from 'lucide-react'
import { site } from '@/content/site'
import { Eyebrow, Reveal } from './common'

export function Problem() {
  return <section id="problema" className="section problem-section" aria-labelledby="problem-title">
    <div className="container">
      <Reveal className="section-heading problem-heading"><Eyebrow>O GARGALO ESTÁ ENTRE OS SISTEMAS</Eyebrow>
        <h2 id="problem-title">O problema raramente é<br /><span className="text-muted">“falta de software”.</span></h2>
        <p>Na maioria das vezes, a empresa já tem sistema.<br /><strong>O problema é tudo o que acontece fora dele.</strong></p>
      </Reveal>
      <div className="problem-grid">{site.problems.map(({ icon: Icon, title, description }, index) => <Reveal key={title} delay={index * 0.035} className="problem-item"><span className="problem-icon"><Icon size={21} strokeWidth={1.6} /></span><h3>{title}</h3><p>{description}</p></Reveal>)}</div>
      <Reveal className="problem-callout"><div><span className="callout-label">O CUSTO DO IMPROVISO</span><p>Se sua empresa precisa criar processos para compensar as limitações do sistema, existe um gargalo tecnológico custando tempo e dinheiro todos os dias.</p></div><ArrowUpRight size={31} strokeWidth={1.4} aria-hidden="true" /></Reveal>
    </div>
  </section>
}
