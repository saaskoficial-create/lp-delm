import { useEffect, useId, useState, type RefObject } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

// Geometry adapted from dillionverma's Animated Beam (21st.dev / Magic UI).
// A single four-second pass explains data flow; reduced motion stays static.
export function AnimatedBeam({ container, from, to, curvature = 0, delay = 0 }: {
  container: RefObject<HTMLElement | null>
  from: RefObject<HTMLElement | null>
  to: RefObject<HTMLElement | null>
  curvature?: number
  delay?: number
}) {
  const id = useId()
  const reduced = useReducedMotion()
  const visible = useInView(container, { once: true, amount: 0.4 })
  const [geometry, setGeometry] = useState({ path: '', width: 0, height: 0 })

  useEffect(() => {
    if (!container.current || !from.current || !to.current) return
    const wrapper = container.current
    const source = from.current
    const target = to.current
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = wrapper.getBoundingClientRect()
        const start = source.getBoundingClientRect()
        const end = target.getBoundingClientRect()
        const x1 = start.x - bounds.x + start.width / 2
        const y1 = start.y - bounds.y + start.height / 2
        const x2 = end.x - bounds.x + end.width / 2
        const y2 = end.y - bounds.y + end.height / 2
        setGeometry({ width: bounds.width, height: bounds.height, path: `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - curvature} ${x2} ${y2}` })
      })
    }
    const observer = new ResizeObserver(measure)
    ;[wrapper, source, target].forEach((node) => observer.observe(node))
    measure()
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [container, from, to, curvature])

  return <svg className="animated-beam" width={geometry.width} height={geometry.height} viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true" focusable="false">
    <path d={geometry.path} stroke="var(--connection-line)" strokeWidth="2" fill="none" />
    <path d={geometry.path} stroke={`url(#${id})`} strokeWidth="2.5" fill="none" />
    <defs><motion.linearGradient id={id} gradientUnits="userSpaceOnUse" initial={{ x1: '0%', x2: '0%', y1: '0%', y2: '0%' }} animate={visible && !reduced ? { x1: ['-20%', '120%'], x2: ['0%', '140%'] } : undefined} transition={{ duration: 4, delay, ease: 'linear' }}><stop stopColor="var(--primary)" stopOpacity="0" /><stop offset="0.5" stopColor="var(--primary)" /><stop offset="1" stopColor="var(--primary)" stopOpacity="0" /></motion.linearGradient></defs>
  </svg>
}
