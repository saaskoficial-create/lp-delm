import { ArrowRight, Check, ClipboardList, Database, Layers3, PackageCheck, Truck, Users, Warehouse } from 'lucide-react'
import { site } from '@/content/site'
import { Cta, Eyebrow, Reveal } from './common'

function OperationsVisual() {
  return <figure className="operations-visual">
    <div className="visual-index"><span>OPERAÇÃO B2B</span><span>PROCESSOS CONECTADOS</span></div>
    <div className="operations-flow">
      <div className="operation-step"><span className="operation-step-icon"><ClipboardList size={23} /></span><div><small>01 / ENTRADA</small><strong>Uma solicitação.</strong><span>Ordens e informações organizadas.</span></div></div>
      <div className="operation-connector"><span /><ArrowRight size={14} /></div>
      <div className="operation-step"><span className="operation-step-icon"><Layers3 size={23} /></span><div><small>02 / PROCESSO</small><strong>Suas regras.</strong><span>Aprovações e etapas integradas.</span></div></div>
      <div className="operation-connector"><span /><ArrowRight size={14} /></div>
      <div className="operation-step"><span className="operation-step-icon"><Users size={23} /></span><div><small>03 / OPERAÇÃO</small><strong>Equipes conectadas.</strong><span>A informação chega a quem precisa.</span></div></div>
    </div>
    <figcaption>Um exemplo de fluxo. A solução acompanha o seu processo.</figcaption>
  </figure>
}

function LogisticsVisual() {
  return <figure className="logistics-visual">
    <div className="logistics-diagram" role="img" aria-label="Diagrama de integração entre gestão, armazenagem e transporte.">
      <svg viewBox="0 0 460 320" fill="none" aria-hidden="true"><path d="M230 82V151M90 218V153H370V218M230 153V218" stroke="#8593ff" strokeWidth="1.5" strokeDasharray="5 5" /><circle cx="230" cy="152" r="7" fill="#91a0ff" /><circle cx="230" cy="152" r="17" stroke="#91a0ff" strokeOpacity=".3" /></svg>
      <div className="logistics-central"><span>DELM</span><strong>Integração sob medida</strong></div>
      <div className="logistics-node logistics-erp"><Database size={25} /><strong>ERP</strong><span>Gestão</span></div>
      <div className="logistics-node logistics-wms"><Warehouse size={25} /><strong>WMS</strong><span>Armazenagem</span></div>
      <div className="logistics-node logistics-tms"><Truck size={25} /><strong>TMS</strong><span>Transporte</span></div>
    </div>
    <figcaption><PackageCheck size={16} />Da informação à expedição. No mesmo fluxo.</figcaption>
  </figure>
}

export function B2B() {
  return <section id="b2b" className="section b2b-section section-anchor" aria-labelledby="b2b-title">
    <div className="container audience-grid">
      <Reveal className="audience-visual"><OperationsVisual /></Reveal>
      <Reveal className="audience-copy"><Eyebrow>PARA EMPRESAS B2B</Eyebrow><h2 id="b2b-title">Quando a operação cresce, <span className="text-blue">o improviso começa a ficar caro.</span></h2>
        <p>Uma planilha. Um ERP básico. Um controle manual. Um processo que “sempre funcionou assim”.</p><p>Até que o volume aumentou. Mais clientes, pessoas, etapas e exceções. <strong>E o que era simples virou retrabalho.</strong></p>
        <p>A DELM desenvolve tecnologia para transformar processos manuais e desconectados em uma operação mais integrada e escalável.</p>
        <ul className="application-list">{site.b2bApplications.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul>
        <Cta>Quero integrar minha operação</Cta>
      </Reveal>
    </div>
  </section>
}

export function Logistics() {
  return <section id="logistica" className="section logistics-section section-anchor" aria-labelledby="logistics-title">
    <div className="container">
      <div className="logistics-grid"><Reveal className="logistics-copy"><Eyebrow light>PARA OPERAÇÕES LOGÍSTICAS</Eyebrow><h2 id="logistics-title">ERP de um lado.<br />WMS do outro.<br />TMS em outro.</h2><p className="logistics-punchline">E a planilha tentando ligar tudo.</p><p>Informação duplicada, pedidos atualizados atrasados, conferência manual e baixa visibilidade. Pequenas falhas de integração viram grandes problemas.</p><p>Desenvolvemos sistemas e integrações para transportadoras, operadores logísticos, distribuidoras e operações com frota, armazenagem e centros de distribuição.</p></Reveal><Reveal><LogisticsVisual /></Reveal></div>
      <Reveal className="logistics-applications"><span className="dark-label">ONDE A TECNOLOGIA PODE ENTRAR</span><div>{site.logisticsApplications.map((item) => <span key={item}>{item}<ArrowRight size={13} aria-hidden="true" /></span>)}</div></Reveal>
      <Reveal className="logistics-bottom"><p>Menos retrabalho entre setores.<br /><strong>Mais conexão entre as etapas.</strong></p><Cta light>Quero conectar meus sistemas</Cta></Reveal>
    </div>
  </section>
}
