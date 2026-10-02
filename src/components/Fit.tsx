import { ArrowUpRight, Check } from 'lucide-react'
import { site } from '@/content/site'
import { Cta, Eyebrow, Reveal } from './common'

export function IdealClient() {
  return <section className="section ideal-section" aria-labelledby="ideal-title"><div className="container ideal-grid"><Reveal><Eyebrow>FAZ SENTIDO PARA VOCÊ?</Eyebrow><h2 id="ideal-title">Quando o problema já passou do ponto de uma <span className="text-blue">solução genérica.</span></h2><p>A DELM faz sentido para empresas que precisam de tecnologia acompanhando a realidade da operação.</p></Reveal><Reveal><ul className="ideal-list">{site.ideal.map((item) => <li key={item}><span><Check size={15} /></span>{item}</li>)}</ul></Reveal></div></section>
}

export function HonestFit() {
  return <section className="honest-section" aria-labelledby="honest-title"><div className="container"><Reveal className="honest-panel"><div><Eyebrow>UMA CONVERSA HONESTA</Eyebrow><h2 id="honest-title">Talvez você não precise de software <span className="text-blue">sob medida.</span></h2><Cta>Vamos entender se faz sentido</Cta></div><div className="honest-copy"><ArrowUpRight className="honest-arrow" size={45} strokeWidth={1.2} /><p>Se existe uma ferramenta pronta que resolve exatamente o seu problema por um custo menor, essa provavelmente é a melhor decisão.</p><p>A DELM entra quando a operação possui particularidades, integrações ou processos que ferramentas prontas não conseguem atender de forma eficiente.</p><p className="honest-conclusion">Nosso objetivo não é desenvolver software a qualquer custo. <strong>É entender se tecnologia sob medida realmente faz sentido para sua operação.</strong></p></div></Reveal></div></section>
}
