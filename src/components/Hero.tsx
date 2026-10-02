import { motion, useReducedMotion } from 'framer-motion'
import { site } from '@/content/site'
import { Cta } from './common'

export function Hero() {
  const reduced = useReducedMotion()
  return <section id="inicio" className="hero section-anchor" aria-labelledby="hero-title">
    <div className="container hero-grid">
      <motion.div className="hero-copy" initial={reduced ? false : { opacity: 0, transform: 'translateY(12px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
        <p className="hero-context">Tecnologia para empresas B2B e logística</p>
        <h1 id="hero-title">{site.hero.title}</h1>
        <p className="hero-description">{site.hero.description}</p>
        <Cta />
        <p className="hero-note">{site.hero.note}</p>
      </motion.div>
      <motion.figure className="hero-portrait" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.65, delay: 0.1 }}>
        <img src="/images/operacao-humana-1100.webp" srcSet="/images/operacao-humana-600.webp 600w, /images/operacao-humana-1100.webp 1100w" sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 43vw, 490px" alt="Cena ilustrativa de profissionais analisando uma operação logística com um tablet." width="1100" height="1375" fetchPriority="high" />
        <figcaption><span className="portrait-symbol" aria-hidden="true"><img src="/brand/delm-symbol.jpg" alt="" width="44" height="44" /></span><p>Tecnologia começa com<br /><strong>quem vive a operação.</strong></p></figcaption>
      </motion.figure>
    </div>
  </section>
}
