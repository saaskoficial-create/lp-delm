import { ArrowUpRight } from 'lucide-react'
import { site } from '@/content/site'
import { Cta, Eyebrow, Reveal } from './common'

export function Solutions() {
  return <section id="solucoes" className="section solutions-section section-anchor" aria-labelledby="solutions-title">
    <div className="container">
      <Reveal className="split-heading"><div><Eyebrow>TECNOLOGIA COM PROPÓSITO</Eyebrow><h2 id="solutions-title">Não começamos pelo código.<br /><span className="text-blue">Começamos pelo processo.</span></h2></div><p>A DELM entende primeiro como sua operação funciona, onde estão os gargalos e quais etapas realmente precisam de tecnologia. Só depois definimos a solução.</p></Reveal>
      <div className="solutions-grid">{site.solutions.map(({ icon: Icon, title, description, tag }, index) => <Reveal key={title} delay={index * 0.04} className="solution-card"><div className="solution-card-top"><span className="solution-icon"><Icon size={24} strokeWidth={1.6} /></span><span className="solution-number">0{index + 1}</span></div><h3>{title}</h3><p>{description}</p><div className="solution-card-bottom"><span>{tag}</span><ArrowUpRight size={18} aria-hidden="true" /></div></Reveal>)}</div>
      <Reveal className="solutions-bottom"><p>Você não precisa comprar mais uma ferramenta.<br /><strong>Precisa resolver o ponto que hoje trava sua operação.</strong></p><Cta /></Reveal>
    </div>
  </section>
}
