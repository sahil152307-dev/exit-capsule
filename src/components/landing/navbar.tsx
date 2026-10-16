import { Github } from 'lucide-react'

const GITHUB_URL = 'https://github.com/sahil152307-dev/exit-capsule'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#live-capsule', label: 'Live Capsule' },
  { href: '#features', label: 'Features' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#21262d] bg-[#0d1117]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5" aria-label="ExitKit home">
          <span className="text-[15px] font-semibold tracking-tight text-[#f0f6fc]">
            ExitKit
          </span>
          <span className="rounded border border-[#30363d] bg-[#161b22] px-1.5 py-0.5 font-mono text-[11px] text-[#8b949e]">
            v1.0.0
          </span>
        </a>

        <nav className="flex items-center gap-1" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden rounded-md px-3 py-1.5 text-sm text-[#8b949e] transition-colors hover:text-[#c9d1d9] md:block"
            >
              {link.label}
            </a>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="View ExitKit on GitHub"
            className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#30363d] text-[#8b949e] transition-colors hover:border-[#8b949e] hover:text-[#c9d1d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388bfd]"
          >
            <Github className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  )
}
