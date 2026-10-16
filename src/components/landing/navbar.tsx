import { ExternalLink, Github, Package, Terminal } from 'lucide-react'

const NAV_LINKS = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#usage', label: 'Usage' },
  { href: '#architecture', label: 'Architecture' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0D1117]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="group flex items-center gap-2.5" aria-label="Exit Capsule Agent home">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_16px_rgba(16,185,129,0.25)] transition-shadow duration-300 group-hover:shadow-[0_0_26px_rgba(16,185,129,0.45)]">
            <Terminal className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="flex flex-col leading-tight">
            <span className="font-mono text-sm font-semibold tracking-tight text-white">
              exit-capsule
            </span>
            <span className="text-[10px] tracking-wide text-slate-500">
              Dependency Intelligence Agent
            </span>
          </span>
        </a>

        <nav className="flex items-center gap-1" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-emerald-300 md:block"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://pypi.org/project/exit-capsule/"
            target="_blank"
            rel="noreferrer"
            className="ml-1 hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-cyan-300 sm:inline-flex"
          >
            <Package className="h-4 w-4" />
            PyPI
          </a>
          <a
            href="https://github.com/exitkit/exit-capsule"
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-slate-200 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            <Github className="h-4 w-4" />
            GitHub
            <ExternalLink className="h-3 w-3 text-slate-500" />
          </a>
        </nav>
      </div>
    </header>
  )
}
