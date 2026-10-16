import { BookOpen, Github, Package, Terminal } from 'lucide-react'

const FOOTER_LINKS = [
  {
    href: 'https://github.com/exitkit/exit-capsule',
    label: 'GitHub Repo',
    icon: Github,
    external: true,
  },
  {
    href: 'https://pypi.org/project/exit-capsule/',
    label: 'PyPI Package Page',
    icon: Package,
    external: true,
  },
  {
    href: 'https://github.com/exitkit/exit-capsule#readme',
    label: 'Documentation',
    icon: BookOpen,
    external: true,
  },
]

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/[0.06] bg-[#0b0f14]/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 px-4 py-12 sm:px-6">
        {/* Brand */}
        <a href="#" className="group flex items-center gap-2.5" aria-label="Back to top">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_16px_rgba(16,185,129,0.2)] transition-shadow group-hover:shadow-[0_0_24px_rgba(16,185,129,0.4)]">
            <Terminal className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="font-mono text-sm font-semibold text-white">exit-capsule</span>
        </a>

        {/* Links */}
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-2">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-emerald-300"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </a>
          ))}
        </nav>

        {/* Tagline */}
        <p className="text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
          Built with{' '}
          <span className="font-mono text-emerald-400/90">Typer</span>,{' '}
          <span className="font-mono text-emerald-400/90">Rich</span>, and{' '}
          <span className="font-mono text-cyan-400/90">Google Gemini AI</span>
          <span className="mx-2 text-slate-700">|</span>
          Production-Ready Open Source Tool
        </p>

        <p className="font-mono text-[11px] text-slate-600">
          © {new Date().getFullYear()} exitkit · MIT License
        </p>
      </div>
    </footer>
  )
}
