import { useRef, useState, type MouseEvent } from 'react'
import { Menu, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Brand } from './common'
import { site } from '@/content/site'

export function Header() {
  const [open, setOpen] = useState(false)
  const pendingAnchor = useRef<string | null>(null)
  function navigateFromMenu(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault()
    pendingAnchor.current = href
    setOpen(false)
  }
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {site.navigation.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <Button asChild className="header-cta"><a href="#diagnostico">Mapear meu gargalo<ArrowUpRight size={16} aria-hidden="true" /></a></Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mobile-menu-trigger" aria-label="Abrir menu"><Menu size={22} /></Button>
          </SheetTrigger>
          <SheetContent className="mobile-menu" side="right" aria-describedby={undefined} onCloseAutoFocus={(event) => {
            const href = pendingAnchor.current
            if (!href) return
            event.preventDefault()
            pendingAnchor.current = null
            // Wait until the sheet releases body scroll and focus before following the anchor.
            requestAnimationFrame(() => {
              const target = document.getElementById(href.slice(1))
              if (!target) return
              window.history.pushState(null, '', href)
              target.tabIndex = -1
              target.focus({ preventScroll: true })
              // CSS chooses smooth scrolling only when reduced motion is not requested.
              target.scrollIntoView({ behavior: 'auto', block: 'start' })
            })
          }}>
            <SheetHeader><SheetTitle>DELM — navegação</SheetTitle></SheetHeader>
            <nav aria-label="Navegação mobile">
              {site.navigation.map((link) => <SheetClose asChild key={link.href}><a href={link.href} onClick={(event) => navigateFromMenu(event, link.href)}>{link.label}<ArrowUpRight size={18} /></a></SheetClose>)}
              <SheetClose asChild><a href="#diagnostico" onClick={(event) => navigateFromMenu(event, '#diagnostico')} className="mobile-menu-cta">Mapear meu gargalo<ArrowUpRight size={18} /></a></SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  </>
}
