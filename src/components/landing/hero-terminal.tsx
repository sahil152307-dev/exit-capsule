'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { TerminalWindow } from './terminal-window'

/* ------------------------------------------------------------------ */
/* Top card — animated scan terminal (original content)                */
/* ------------------------------------------------------------------ */

const COMMAND = 'exit-capsule scan . --verify'

const OUTPUT_LINES = [
  'Real Manifest Parsing (requirements.txt, pyproject.toml, setup.py)',
  'Real AST Code Scanning (Active, Unused, and Undeclared mapped)',
  'Subprocess Pytest Runner (Execution verified in sandbox)',
  'Gemini AI Migration Reasoning Generated',
] as const

const TYPE_MS = 32
const LINE_GAP_MS = 330

function Caret() {
  return (
    <span
      aria-hidden
      className="animate-caret ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] bg-[#8b949e]"
    />
  )
}

export function ScanTerminal() {
  const [typed, setTyped] = useState(0)
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= COMMAND.length; i++) {
      timers.push(setTimeout(() => setTyped(i), 350 + TYPE_MS * i))
    }
    const outStart = 350 + TYPE_MS * COMMAND.length + 550
    OUTPUT_LINES.forEach((_, idx) => {
      timers.push(setTimeout(() => setVisible(idx + 1), outStart + LINE_GAP_MS * idx))
    })
    timers.push(
      setTimeout(
        () => setVisible(OUTPUT_LINES.length + 1),
        outStart + LINE_GAP_MS * OUTPUT_LINES.length + 520
      )
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const typing = typed < COMMAND.length
  const done = visible > OUTPUT_LINES.length

  return (
    <TerminalWindow title="exit-capsule — ~/legacy-project">
      <div className="scrollbar-slim overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.9] sm:px-5 sm:text-[13px]">
        <div className="sr-only" aria-live="polite">
          exit-capsule scan with verify — manifest parsing, AST code scanning, subprocess pytest
          runner and Gemini AI migration reasoning complete. Generated DEPENDENCY_EXIT_CAPSULE.md.
        </div>
        <div className="flex items-start gap-2 whitespace-nowrap">
          <span className="select-none text-[#6e7681]">$</span>
          <span className="text-[#c9d1d9]">
            {COMMAND.slice(0, typed)}
            {typing ? <Caret /> : null}
          </span>
        </div>

        <div aria-hidden>
          {OUTPUT_LINES.slice(0, Math.min(visible, OUTPUT_LINES.length)).map((line, i) => (
            <div key={i} className="terminal-line flex items-start gap-2 py-0.5">
              <Check className="mt-[4px] h-3.5 w-3.5 shrink-0 text-[#3fb950]" />
              <span className="text-[#c9d1d9]">{line}</span>
            </div>
          ))}

          {done ? (
            <div className="terminal-line flex items-start gap-2 py-0.5">
              <Sparkles className="mt-[4px] h-3.5 w-3.5 shrink-0 text-[#d2a8ff]" />
              <span className="text-[#c9d1d9]">
                Generated{' '}
                <span className="font-semibold text-[#3fb950]">DEPENDENCY_EXIT_CAPSULE.md</span>!
              </span>
            </div>
          ) : null}

          {done ? (
            <div className="flex items-center gap-2 pt-0.5 whitespace-nowrap">
              <span className="select-none text-[#6e7681]">$</span>
              <Caret />
            </div>
          ) : null}
        </div>
      </div>
    </TerminalWindow>
  )
}

/* ------------------------------------------------------------------ */
/* Bottom card — animated capsule summary                              */
/* ------------------------------------------------------------------ */

const SUMMARY_ROWS = [
  { label: 'Active (used)', count: 18, pct: 72, bar: 'bg-[#3fb950]', count: 'text-[#3fb950]' },
  { label: 'Unused (bloat)', count: 4, pct: 16, bar: 'bg-[#e3b341]', count: 'text-[#e3b341]' },
  { label: 'Undeclared', count: 2, pct: 9, bar: 'bg-[#f85149]', count: 'text-[#ff7b72]' },
]

export function CapsuleSummaryCard() {
  return (
    <TerminalWindow
      title="DEPENDENCY_EXIT_CAPSULE.md"
      actions={
        <>
          <span className="rounded-full bg-[#8957e5] px-2 py-0.5 font-mono text-[10.5px] font-medium text-white">
            gemini
          </span>
          <span className="rounded-full bg-[#238636] px-2 py-0.5 font-mono text-[10.5px] font-medium text-white">
            pytest
          </span>
        </>
      }
    >
      <div className="space-y-3.5 px-4 py-4 sm:px-5">
        {SUMMARY_ROWS.map((row, i) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-baseline justify-between font-mono text-[11.5px]">
              <span className="text-[#8b949e]">{row.label}</span>
              <span className={row.count}>{row.count}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[#21262d]">
              <motion.div
                className={`h-full rounded-full ${row.bar}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${row.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.18, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}

        <div className="flex items-center gap-1.5 border-t border-[#21262d] pt-3 font-mono text-[11px] text-[#6e7681]">
          <Check className="h-3 w-3 shrink-0 text-[#3fb950]" />
          12/12 pytests passed · exit code 0 · 3.42s
        </div>
      </div>
    </TerminalWindow>
  )
}

export function HeroTerminals() {
  return (
    <div className="flex flex-col gap-4">
      <ScanTerminal />
      <CapsuleSummaryCard />
    </div>
  )
}
