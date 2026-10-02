import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useReducedMotion } from 'framer-motion'
import { Box, Check, Database, FileSpreadsheet, Route, Workflow } from 'lucide-react'

gsap.registerPlugin(useGSAP)

const systems = [
  { key: 'erp', name: 'ERP', description: 'Gestão da empresa', icon: Database, top: '9%', rows: ['Pedidos', 'Financeiro'] },
  { key: 'wms', name: 'WMS', description: 'Gestão de estoque', icon: Box, top: '35%', rows: ['Estoque', 'Expedição'] },
  { key: 'tms', name: 'TMS', description: 'Gestão de transporte', icon: Route, top: '61%', rows: ['Rotas', 'Entregas'] },
]

export function IntegrationDiagram() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useGSAP(() => {
    if (reduced) return
    gsap.from('.system-node', { y: 12, opacity: 0, duration: 0.8, stagger: 0.15, delay: 0.2 })
    gsap.to('.flow-pulse', { strokeDashoffset: -80, duration: 3.5, repeat: -1, ease: 'none' })
    gsap.to('.diagram-hub', { y: -5, repeat: -1, yoyo: true, duration: 2.4, ease: 'sine.inOut' })
  }, { scope: ref, dependencies: [reduced], revertOnUpdate: true })

  return <figure className="integration-figure" ref={ref}>
    <div className="diagram-topline"><span className="diagram-topline-dot" />SEU PROCESSO, CONECTADO<span className="diagram-topline-code">01 / INTEGRAÇÃO</span></div>
    <div className="diagram-stage" role="img" aria-label="Diagrama ilustrativo: ERP, WMS e TMS conectados pela DELM em uma operação integrada.">
      <div className="diagram-orbit orbit-one" /><div className="diagram-orbit orbit-two" />
      <svg className="diagram-lines" viewBox="0 0 560 500" fill="none" aria-hidden="true">
        <defs><linearGradient id="line-blue" x1="180" y1="0" x2="460" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#a0aaff" /><stop offset="1" stopColor="#3e4fe8" /></linearGradient></defs>
        {['M 180 103 C 247 103 231 235 300 235', 'M 180 233 L 300 233', 'M 180 363 C 247 363 231 235 300 235', 'M 329 235 L 441 235'].map((d) => <g key={d}><path d={d} stroke="#dce1f4" strokeWidth="2" /><path className="flow-pulse" d={d} stroke="url(#line-blue)" strokeWidth="2" strokeDasharray="8 32" /></g>)}
        <circle cx="221" cy="235" r="4" fill="#3e4fe8" /><circle cx="401" cy="235" r="4" fill="#3e4fe8" />
      </svg>
      {systems.map(({ key, name, description, icon: Icon, top, rows }) => <div key={key} className={`system-node node-${key}`} style={{ top }}>
        <div className="system-heading"><div className="system-icon"><Icon size={17} /></div><div><strong>{name}</strong><span>{description}</span></div></div>
        <div className="system-rows">{rows.map((row) => <span key={row}><span className="row-line" />{row}<span className="row-marker" /></span>)}</div>
      </div>)}
      <div className="diagram-hub"><img src="/brand/delm-symbol.jpg" alt="" width="76" height="76" /><span>DELM</span></div>
      <div className="system-node output-node">
        <span className="output-icon"><Workflow size={21} /></span>
        <strong>Uma operação.<br />Todos os sistemas.</strong>
        <span className="output-caption">Dados no mesmo fluxo.</span>
        <span className="output-check"><Check size={12} />Integração sob medida</span>
      </div>
      <div className="spreadsheet-note"><FileSpreadsheet size={15} /><span>Sem a planilha fazendo a ponte.</span></div>
    </div>
    <figcaption><span className="caption-line" />Da informação isolada ao processo conectado.</figcaption>
  </figure>
}
