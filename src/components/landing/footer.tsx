import { BookOpen, Github, Package } from 'lucide-react'

const GITHUB_URL = 'https://github.com/sahil152307-dev/exit-capsule'

const FOOTER_LINKS = [
  { href: GITHUB_URL, label: 'GitHub Repo', icon: Github },
  { href: 'https://pypi.org/project/exit-capsule/', label: 'PyPI Package Page', icon: Package },
  { href: `${GITHUB_URL}#readme`, label: 'Documentation', icon: BookOpen },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#21262d] bg-[#0d1117]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <a href="#" className="flex items-center gap-2.5" aria-label="Back to top">
            <span className="text-[15px] font-semibold tracking-tight text-[#f0f6fc]">
              ExitKit
            </span>
            <span className="rounded border border-[#30363d] bg-[#161b22] px-1.5 py-0.5 font-mono text-[11px] text-[#8b949e]">
              v1.0.0
            </span>
          </a>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-1">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-[#8b949e] transition-colors hover:text-[#c9d1d9]"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-1 border-t border-[#21262d] pt-6">
          <p className="text-[13px] text-[#8b949e]">
            Built with <span className="font-mono text-[#c9d1d9]">Typer</span>,{' '}
            <span className="font-mono text-[#c9d1d9]">Rich</span>, and{' '}
            <span className="font-mono text-[#c9d1d9]">Google Gemini AI</span> — production-ready
            open source tool.
          </p>
          <p className="font-mono text-[11.5px] text-[#6e7681]">
            © {new Date().getFullYear()} ExitKit · MIT License
          </p>
        </div>
      </div>
    </footer>
  )
}
