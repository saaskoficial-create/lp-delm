import { ArrowDown, Braces, Network, Workflow } from 'lucide-react'
import { site } from '@/content/site'
import { Cta, Eyebrow, Reveal } from './common'
import { IntegrationDiagram } from './IntegrationDiagram'

export function Hero() {
  return <section id="inicio" className="hero section-anchor" aria-labelledby="hero-title">
    <div className="container hero-grid">
      <Reveal className="hero-copy">
        <Eyebrow>{site.hero.eyebrow}</Eyebrow>
        <h1 id="hero-title">Se sua equipe criou <span className="highlight-word">planilhas</span> para fazer o sistema funcionar, <span className="hero-final">o sistema já falhou.</span></h1>
        <p className="hero-description">{site.hero.description}</p>
        <Cta />
        <p className="hero-note">{site.hero.note}</p>
      </Reveal>
      <IntegrationDiagram />
    </div>
    <div className="container hero-bottom">
      <div className="hero-capabilities"><span><Network size={16} />Integrações</span><span><Workflow size={16} />Automações</span><span><Braces size={16} />Sistemas sob medida</span></div>
      <a href="#problema" className="hero-explore">Entenda o gargalo<ArrowDown size={15} aria-hidden="true" /></a>
    </div>
  </section>
}
