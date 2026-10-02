import { useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { site } from '@/content/site'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return <a href="#inicio" className={cn('brand', inverse && 'brand-inverse')} aria-label="DELM — início">
    <img src="/brand/delm-symbol.jpg" alt="" width="44" height="44" />
    <span>DELM<span className="brand-dot">.</span></span>
  </a>
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  const element = useRef<HTMLDivElement>(null)
  const inView = useInView(element, { amount: 0.08 })
  return <motion.div
    ref={element}
    className={className}
    initial={reduced ? false : { opacity: 0, y: 18 }}
    animate={{ opacity: reduced || inView ? 1 : 0, y: reduced || inView ? 0 : 18 }}
    transition={{ duration: inView ? 0.5 : 0.22, delay: inView ? delay : 0, ease: [0.16, 1, 0.3, 1] }}
  >{children}</motion.div>
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={cn('eyebrow', light && 'eyebrow-light')}><span aria-hidden="true" />{children}</p>
}

export function Cta({ children = site.hero.cta, className, light = false }: { children?: ReactNode; className?: string; light?: boolean }) {
  return <Button asChild className={cn('cta-button', light && 'cta-button-light', className)}>
    <a href="#diagnostico">{children}<ArrowUpRight size={19} aria-hidden="true" /></a>
  </Button>
}
