import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useReducedMotion } from 'framer-motion'
import { Box, Database, Route, Workflow } from 'lucide-react'
import { AnimatedBeam } from './AnimatedBeam'

gsap.registerPlugin(useGSAP)

export function IntegrationDiagram() {
  const container = useRef<HTMLDivElement>(null)
  const erp = useRef<HTMLDivElement>(null)
  const wms = useRef<HTMLDivElement>(null)
  const tms = useRef<HTMLDivElement>(null)
  const hub = useRef<HTMLDivElement>(null)
  const output = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useGSAP(() => {
    if (reduced) return
    gsap.from('.connection-node', { opacity: 0, y: 8, duration: 0.35, stagger: 0.08, scrollTrigger: { trigger: container.current, start: 'top 85%', once: true } })
  }, { scope: container, dependencies: [reduced], revertOnUpdate: true })

  return <figure className="integration-figure">
    <div className="connection-stage" ref={container} role="img" aria-label="Diagrama conceitual: ERP, WMS e TMS conectados pela DELM em uma operação integrada.">
      <AnimatedBeam container={container} from={erp} to={hub} curvature={-25} />
      <AnimatedBeam container={container} from={wms} to={hub} delay={0.15} />
      <AnimatedBeam container={container} from={tms} to={hub} curvature={25} delay={0.3} />
      <AnimatedBeam container={container} from={hub} to={output} delay={0.5} />
      <div className="connection-systems">
        <div ref={erp} className="connection-node"><Database size={20} /><div><strong>ERP</strong><span>Gestão</span></div></div>
        <div ref={wms} className="connection-node"><Box size={20} /><div><strong>WMS</strong><span>Estoque</span></div></div>
        <div ref={tms} className="connection-node"><Route size={20} /><div><strong>TMS</strong><span>Transporte</span></div></div>
      </div>
      <div ref={hub} className="connection-hub"><img src="/brand/delm-symbol.webp" alt="" width="72" height="72" /><strong>DELM</strong></div>
      <div ref={output} className="connection-output"><Workflow size={26} /><strong>Uma operação<br />conectada.</strong><span>Dados no mesmo fluxo.</span></div>
    </div>
    <figcaption>Da informação isolada ao processo conectado.</figcaption>
  </figure>
}
