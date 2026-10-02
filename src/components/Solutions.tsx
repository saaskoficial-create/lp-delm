import { ArrowRight, Braces, Check, GitBranch, Layers3 } from 'lucide-react'
import { site } from '@/content/site'
import { Cta, Reveal } from './common'
import { IntegrationDiagram } from './IntegrationDiagram'

export function Solutions() {
  const [integration, automation, custom, ...more] = site.solutions
  return <section id="solucoes" className="section solutions-section section-anchor" aria-labelledby="solutions-title">
    <div className="container">
      <Reveal className="section-heading solutions-heading"><h2 id="solutions-title">Não começamos pelo código.<br />Começamos pelo processo.</h2><p>A DELM entende primeiro como sua operação funciona, onde estão os gargalos e quais etapas realmente precisam de tecnologia. Só depois definimos a solução.</p></Reveal>
      <div className="solution-integration"><IntegrationDiagram /><div className="solution-feature-copy"><span className="feature-icon"><integration.icon size={26} aria-hidden="true" /></span><h3>{integration.title}</h3><p>{integration.description}</p><p className="feature-outcome">Sem a planilha fazendo a ponte.</p></div></div>
      <div className="solution-pair">
        <article className="solution-feature automation-feature"><div className="automation-illustration" role="img" aria-label="Exemplo de automação: entrada de dados, validação das regras e encaminhamento."><span><Layers3 size={26} /><small>Entrada</small></span><ArrowRight size={20} /><span><GitBranch size={26} /><small>Suas regras</small></span><ArrowRight size={20} /><span><Check size={26} /><small>Próxima etapa</small></span></div><h3>{automation.title}</h3><p>{automation.description}</p></article>
        <article className="solution-feature custom-feature"><div className="custom-illustration" role="img" aria-label="Ilustração de módulos construídos ao redor das regras da empresa."><span className="custom-module module-one" /><span className="custom-module module-two" /><span className="custom-core"><Braces size={42} /></span><span className="custom-module module-three" /><span className="custom-module module-four" /></div><h3>{custom.title}</h3><p>{custom.description}</p></article>
      </div>
      <div className="solution-services">{more.map(({ icon: Icon, title, description }) => <article key={title}><Icon size={25} strokeWidth={1.6} aria-hidden="true" /><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
      <div className="solutions-bottom"><p>Você não precisa comprar mais uma ferramenta.<br /><strong>Precisa resolver o ponto que hoje trava sua operação.</strong></p><Cta /></div>
    </div>
  </section>
}
