import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion'
import { site } from '@/content/site'
import { Cta } from './common'

export function Hero() {
  const reduced = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const exitOpacity = useTransform(scrollYProgress, [0, 0.55, 0.98], [1, 1, 0])
  const copyExit = useTransform(scrollYProgress, [0, 1], [0, -32])
  const photoExit = useTransform(scrollYProgress, [0, 1], [0, -64])
  const entry: Variants = {
    hidden: { opacity: 1, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }
  return <section ref={section} id="inicio" className="hero section-anchor" aria-labelledby="hero-title">
    <div className="container hero-grid">
      <motion.div className="hero-copy" style={{ opacity: reduced ? 1 : exitOpacity, y: reduced ? 0 : copyExit }} initial={false} animate="visible" variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}>
        <motion.p variants={entry} className="hero-context">Tecnologia para empresas B2B e logística</motion.p>
        <motion.h1 variants={entry} id="hero-title">{site.hero.title}</motion.h1>
        <motion.p variants={entry} className="hero-description">{site.hero.description}</motion.p>
        <motion.div variants={entry}><Cta /></motion.div>
        <motion.p variants={entry} className="hero-note">{site.hero.note}</motion.p>
      </motion.div>
      <motion.figure className="hero-portrait" style={{ opacity: reduced ? 1 : exitOpacity, y: reduced ? 0 : photoExit }}>
        <motion.img initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.14, ease: [0.16, 1, 0.3, 1] }} src="/images/operacao-real-1100.webp" srcSet="/images/operacao-real-600.webp 600w, /images/operacao-real-1100.webp 1100w" sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 43vw, 490px" alt="Profissional conferindo informações em um tablet junto a caixas de estoque." width="1100" height="1650" fetchPriority="high" />
        <motion.figcaption initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}><span className="portrait-symbol" aria-hidden="true"><img src="/brand/delm-symbol-132.webp" alt="" width="44" height="44" /></span><p>Tecnologia começa com<br /><strong>quem vive a operação.</strong></p></motion.figcaption>
      </motion.figure>
    </div>
  </section>
}
