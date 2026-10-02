import { ArrowRight, Check, PackageCheck } from 'lucide-react'
import { site } from '@/content/site'
import { Cta, Reveal } from './common'

export function B2B() {
  return <section id="b2b" className="section b2b-section section-anchor" aria-labelledby="b2b-title">
    <div className="container audience-grid">
      <Reveal><figure className="audience-visual"><img src="/images/colaboracao-real-1200.webp" srcSet="/images/colaboracao-real-700.webp 700w, /images/colaboracao-real-1200.webp 1200w" sizes="(max-width: 767px) calc(100vw - 40px), 45vw" alt="Três profissionais reunidos em uma mesa, conversando com apoio de um tablet e um notebook." width="1200" height="800" loading="lazy" /><figcaption><span>Da rotina da equipe</span><ArrowRight size={17} aria-hidden="true" /><strong>à solução certa.</strong></figcaption></figure></Reveal>
      <Reveal className="audience-copy"><p className="section-context">Para empresas B2B</p><h2 id="b2b-title">Quando a operação cresce, o improviso começa a ficar caro.</h2>
        <p>Uma planilha. Um ERP básico. Um controle manual. Um processo que “sempre funcionou assim”.</p><p>Até que o volume aumentou. Mais clientes, pessoas, etapas e exceções. <strong>E o que era simples virou retrabalho.</strong></p>
        <p>A DELM desenvolve tecnologia para transformar processos manuais e desconectados em uma operação mais integrada e escalável.</p>
        <ul className="application-list">{site.b2bApplications.map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul><Cta>Quero integrar minha operação</Cta>
      </Reveal>
    </div>
  </section>
}

export function Logistics() {
  return <section id="logistica" className="section logistics-section section-anchor" aria-labelledby="logistics-title">
    <div className="container">
      <div className="logistics-grid"><Reveal className="logistics-copy"><p className="section-context">Para operações logísticas</p><h2 id="logistics-title">ERP de um lado.<br />WMS do outro.<br />TMS em outro.</h2><p className="logistics-punchline">E a planilha tentando ligar tudo.</p><p>Informação duplicada, pedidos atualizados atrasados, conferência manual e baixa visibilidade. Pequenas falhas de integração viram grandes problemas.</p><p>Desenvolvemos sistemas e integrações para transportadoras, operadores logísticos, distribuidoras e operações com frota, armazenagem e centros de distribuição.</p></Reveal>
        <Reveal delay={0.1}><figure className="logistics-visual"><img src="/images/logistica-real-1200.webp" srcSet="/images/logistica-real-700.webp 700w, /images/logistica-real-1200.webp 1200w" sizes="(max-width: 767px) calc(100vw - 40px), 48vw" alt="Vista de cima de um armazém, com dois profissionais conferindo o estoque entre as prateleiras." width="1200" height="800" loading="lazy" /><figcaption><PackageCheck size={18} aria-hidden="true" /><span>Da informação à expedição.<strong> No mesmo fluxo.</strong></span></figcaption></figure></Reveal>
      </div>
      <div className="logistics-applications"><p>Onde a tecnologia pode entrar</p><div>{site.logisticsApplications.map((item) => <span key={item}>{item}<ArrowRight size={14} aria-hidden="true" /></span>)}</div></div>
      <div className="logistics-bottom"><p>Menos retrabalho entre setores.<br /><strong>Mais conexão entre as etapas.</strong></p><Cta light>Quero conectar meus sistemas</Cta></div>
    </div>
  </section>
}
