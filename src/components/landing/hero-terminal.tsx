'use client'

import { useEffect, useState } from 'react'
import { Check, TriangleAlert } from 'lucide-react'
import { TerminalWindow } from './terminal-window'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Top card — capsule diff view (reference: exit-capsule.md card)      */
/* ------------------------------------------------------------------ */

interface Migration {
  from: string
  fromSuffix: string
  to: string
  toSuffix: string
  confidence: number
  files: string
  tags: {
    kind: 'risk' | 'pass' | 'gap'
    label: string
  }[]
}

const MIGRATIONS: Migration[] = [
  {
    from: 'requests',
    fromSuffix: '-old=2.18.0',
    to: 'httpx',
    toSuffix: '≥0.27.0',
    confidence: 94,
    files: 'parser.py:42 • core.py:108',
    tags: [
      { kind: 'risk', label: 'High Risk' },
      { kind: 'pass', label: '4/4 pytests passed' },
    ],
  },
  {
    from: 'pyyaml',
    fromSuffix: '=3.12',
    to: 'PyYAML',
    toSuffix: '≥ 6.0.1',
    confidence: 97,
    files: 'config.py:9 • cli.py:77',
    tags: [
      { kind: 'risk', label: 'High Risk' },
      { kind: 'gap', label: '1 gap found' },
    ],
  },
]

const TAG_STYLES = {
  risk: 'border-[#f85149]/40 bg-[#f85149]/10 text-[#ff7b72]',
  pass: 'border-[#238636]/50 bg-[#238636]/15 text-[#3fb950]',
  gap: 'border-[#d29922]/40 bg-[#d29922]/10 text-[#e3b341]',
} as const

function MigrationBlock({ migration }: { migration: Migration }) {
  return (
    <div className="px-4 py-4 sm:px-5">
      {/* Row 1 — version transition */}
      <p className="font-mono text-[12.5px] whitespace-nowrap sm:text-[13px]">
        <span className="text-[#79c0ff]">{migration.from}</span>
        <span className="text-[#8b949e]">{migration.fromSuffix}</span>
        <span className="mx-1.5 text-[#d2a8ff]">→</span>
        <span className="text-[#79c0ff]">{migration.to}</span>
        <span className="text-[#e6edf3]">{migration.toSuffix}</span>
      </p>

      {/* Row 2 — confidence bar */}
      <div className="mt-2.5 flex items-center gap-3">
        <div className="h-1 max-w-[240px] flex-1 overflow-hidden rounded-full bg-[#21262d]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8957e5] to-[#6f42c1]"
            style={{ width: `${migration.confidence}%` }}
          />
        </div>
        <p className="font-mono text-[11px] whitespace-nowrap">
          <span className="font-semibold text-[#e6edf3]">{migration.confidence}%</span>{' '}
          <span className="text-[#8b949e]">GEMMA-4</span>
        </p>
      </div>

      {/* Row 3 — file references + status tags */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="font-mono text-[11px] text-[#6e7681]">{migration.files}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {migration.tags.map((tag) => (
            <span
              key={tag.label}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10.5px] whitespace-nowrap',
                TAG_STYLES[tag.kind]
              )}
            >
              {tag.kind === 'pass' ? (
                <Check className="h-3 w-3" />
              ) : (
                <TriangleAlert className="h-3 w-3" />
              )}
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function CapsuleDiffCard() {
  return (
    <TerminalWindow
      title="exit-capsule.md — LinkWatch"
      actions={
        <>
          <span className="rounded-full bg-[#8957e5] px-2 py-0.5 font-mono text-[10.5px] font-medium text-white">
            gemma-4
          </span>
          <span className="rounded-full bg-[#238636] px-2 py-0.5 font-mono text-[10.5px] font-medium text-white">
            pytest
          </span>
        </>
      }
    >
      <div className="divide-y divide-[#21262d]">
        {MIGRATIONS.map((migration) => (
          <MigrationBlock key={migration.from} migration={migration} />
        ))}
      </div>
    </TerminalWindow>
  )
}

/* ------------------------------------------------------------------ */
/* Bottom card — live scan prompt                                      */
/* ------------------------------------------------------------------ */

const SCAN_COMMAND = 'exit-capsule scan ./LinkWatch --verify'

function LiveScanCard() {
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= SCAN_COMMAND.length; i++) {
      timers.push(setTimeout(() => setTyped(i), 500 + 26 * i))
    }
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <TerminalWindow
      title="exitkit — scan ./LinkWatch"
      actions={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#30363d] bg-[#0d1117] px-2 py-0.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3fb950] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
          </span>
          <span className="font-mono text-[10px] font-medium tracking-wide text-[#3fb950]">
            LIVE
          </span>
        </span>
      }
    >
      <div className="scrollbar-slim overflow-x-auto px-4 py-3.5 sm:px-5">
        <p className="font-mono text-[12.5px] whitespace-nowrap text-[#c9d1d9] sm:text-[13px]">
          <span className="mr-2 select-none text-[#6e7681]">$</span>
          {SCAN_COMMAND.slice(0, typed)}
          <span
            aria-hidden
            className="animate-caret ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] bg-[#8b949e]"
          />
        </p>
        <div className="sr-only" aria-live="polite">
          Running exit-capsule scan on LinkWatch with pytest verification
        </div>
      </div>
    </TerminalWindow>
  )
}

/* ------------------------------------------------------------------ */

export function HeroTerminals() {
  return (
    <div className="flex flex-col gap-4">
      <CapsuleDiffCard />
      <LiveScanCard />
    </div>
  )
}
