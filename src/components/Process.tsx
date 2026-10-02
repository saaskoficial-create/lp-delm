import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from 'framer-motion'
import { site } from '@/content/site'
import { Eyebrow, Reveal } from './common'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useGSAP(() => {
    if (reduced) return
    gsap.from('.process-progress', { scaleX: 0, transformOrigin: 'left center', ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 65%', scrub: 0.6 } })
  }, { scope: ref, dependencies: [reduced], revertOnUpdate: true })
  return <section id="processo" className="section process-section section-anchor" aria-labelledby="process-title">
    <div className="container" ref={ref}>
      <Reveal className="section-heading"><Eyebrow>DO GARGALO À SOLUÇÃO</Eyebrow><h2 id="process-title">Da operação atual<br />até a solução funcionando.</h2><p>Um processo para entender, construir e continuar evoluindo.</p></Reveal>
      <div className="process-timeline"><div className="process-progress" aria-hidden="true" />{site.steps.map(({ title, description, icon: Icon }, index) => <Reveal key={title} className="process-step" delay={index * 0.07}><div className="process-step-top"><span className="process-number">0{index + 1}</span><Icon size={20} strokeWidth={1.5} /></div><h3>{title}</h3><p>{description}</p></Reveal>)}</div>
    </div>
  </section>
}
