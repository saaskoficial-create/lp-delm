import { ArrowUpRight } from 'lucide-react'
import { Brand } from './common'
import { site } from '@/content/site'

export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div><Brand /><p>Software sob medida.<br />Para a sua operação.</p></div><nav aria-label="Navegação do rodapé">{site.navigation.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</nav><a className="footer-contact" href="#diagnostico">Vamos conversar<ArrowUpRight size={19} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} DELM. Todos os direitos reservados.</span><span>Sistemas. Integrações. Automações.</span></div></div></footer>
}
