import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { site } from '@/content/site'
import { Reveal } from './common'

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '160px' })
  useEffect(() => {
    if (!inView || reduced) return
    let disposed = false
    let context: { revert: () => void } | undefined
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (disposed || !ref.current) return
      gsap.registerPlugin(ScrollTrigger)
      context = gsap.context(() => {
        gsap.from('.process-progress', { scaleX: 0, transformOrigin: 'left center', ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 65%', scrub: 0.6 } })
      }, ref)
    }).catch(() => { /* The process remains readable without optional animation. */ })
    return () => { disposed = true; context?.revert() }
  }, [inView, reduced])
  return <section id="processo" className="section process-section section-anchor" aria-labelledby="process-title">
    <div className="container" ref={ref}>
      <Reveal className="section-heading"><h2 id="process-title">Da operação atual<br />até a solução funcionando.</h2><p>Um processo para entender, construir e continuar evoluindo.</p></Reveal>
      <div className="process-timeline"><div className="process-progress" aria-hidden="true" />{site.steps.map(({ title, description, icon: Icon }, index) => <article key={title} className="process-step"><div className="process-step-top"><span className="process-number">0{index + 1}</span><Icon size={28} strokeWidth={1.5} aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></article>)}</div>
    </div>
  </section>
}
