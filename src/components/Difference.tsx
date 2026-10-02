import { Check } from 'lucide-react'
import { site } from '@/content/site'
import { Eyebrow, Reveal } from './common'

export function Difference() {
  return <section className="section difference-section" aria-labelledby="difference-title">
    <div className="container">
      <Reveal><Eyebrow>A LÓGICA É OUTRA</Eyebrow><h2 id="difference-title">Seu processo não precisa<br className="desktop-break" /> caber no software.<br /><span className="text-blue">O software pode ser construído<br className="desktop-break" /> para caber no processo.</span></h2></Reveal>
      <div className="difference-bottom"><Reveal className="difference-statement"><span className="code-mark" aria-hidden="true">{'{ }'}</span><p>Tecnologia adaptada<br /><strong>à sua operação.</strong></p></Reveal><Reveal className="difference-description"><p>Ferramentas prontas funcionam quando a operação é padrão. Quando sua empresa possui regras próprias, integrações específicas e diferentes etapas de aprovação, adaptar a empresa ao sistema pode custar mais do que desenvolver a solução certa.</p><ul>{site.differentiators.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></Reveal></div>
    </div>
  </section>
}
