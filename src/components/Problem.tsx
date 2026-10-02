import { ArrowUpRight } from 'lucide-react'
import { site } from '@/content/site'
import { Reveal } from './common'

export function Problem() {
  return <section id="problema" className="section problem-section" aria-labelledby="problem-title">
    <div className="container">
      <Reveal className="section-heading problem-heading">
        <h2 id="problem-title">O problema raramente é “falta de software”.</h2>
        <p>Na maioria das vezes, a empresa já tem sistema.<br /><strong>O problema é tudo o que acontece fora dele.</strong></p>
      </Reveal>
      <div className="problem-grid">{site.problems.map(({ icon: Icon, title, description }) => <article key={title} className="problem-item"><span className="problem-icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p></article>)}</div>
      <div className="problem-callout"><p>Se sua empresa precisa criar processos para compensar as limitações do sistema, existe um gargalo tecnológico custando tempo e dinheiro todos os dias.</p><ArrowUpRight size={31} strokeWidth={1.4} aria-hidden="true" /></div>
    </div>
  </section>
}
