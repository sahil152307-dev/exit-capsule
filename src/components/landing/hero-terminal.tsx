'use client'

import { useEffect, useState } from 'react'
import { Check, RotateCcw, Sparkles } from 'lucide-react'
import { TerminalWindow } from './terminal-window'

const COMMAND = 'exit-capsule scan . --verify'

const OUTPUT_LINES = [
  { kind: 'check', text: 'Real Manifest Parsing (requirements.txt, pyproject.toml, setup.py)' },
  { kind: 'check', text: 'Real AST Code Scanning (Active, Unused, and Undeclared mapped)' },
  { kind: 'check', text: 'Subprocess Pytest Runner (Execution verified in sandbox)' },
  { kind: 'check', text: 'Gemini AI Migration Reasoning Generated' },
  { kind: 'sparkle', text: 'Generated DEPENDENCY_EXIT_CAPSULE.md!' },
] as const

const TYPE_DELAY_MS = 34
const OUTPUT_GAP_MS = 340

function Caret() {
  return (
    <span
      aria-hidden
      className="animate-caret ml-0.5 inline-block h-[15px] w-[7px] translate-y-[2px] bg-emerald-400"
    />
  )
}

/** Terminal that types the scan command, then streams verification results. */
export function HeroTerminal() {
  const [runKey, setRunKey] = useState(0)
  const [typed, setTyped] = useState(0)
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    setTyped(0)
    setVisible(0)
    const timers: ReturnType<typeof setTimeout>[] = []

    for (let i = 1; i <= COMMAND.length; i++) {
      timers.push(setTimeout(() => setTyped(i), 300 + TYPE_DELAY_MS * i))
    }

    const outputStart = 300 + TYPE_DELAY_MS * COMMAND.length + 550
    OUTPUT_LINES.forEach((_, idx) => {
      timers.push(setTimeout(() => setVisible(idx + 1), outputStart + OUTPUT_GAP_MS * idx))
    })

    return () => timers.forEach(clearTimeout)
  }, [runKey])

  const typing = typed < COMMAND.length
  const allVisible = visible >= OUTPUT_LINES.length

  return (
    <TerminalWindow
      title="exit-capsule — ~/legacy-project"
      actions={
        <button
          type="button"
          onClick={() => setRunKey((k) => k + 1)}
          aria-label="Replay terminal demo"
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-slate-500 transition-all hover:border-emerald-500/40 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      }
    >
      <div className="scrollbar-slim overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.95] sm:p-5 sm:text-[13.5px]">
        <div className="sr-only" aria-live="polite">
          exit-capsule scan dot verify — manifest parsing, AST code scanning, pytest runner and
          Gemini AI migration all verified. Generated DEPENDENCY_EXIT_CAPSULE.md.
        </div>
        <div className="flex items-start gap-2 whitespace-nowrap">
          <span className="select-none text-emerald-500">$</span>
          <span className="text-slate-100">
            {COMMAND.slice(0, typed)}
            {typing ? <Caret /> : null}
          </span>
        </div>

        <div aria-hidden>
          {OUTPUT_LINES.slice(0, visible).map((line, i) => (
            <div key={i} className="terminal-line flex items-start gap-2 py-0.5">
              {line.kind === 'check' ? (
                <Check className="mt-[5px] h-3.5 w-3.5 shrink-0 text-emerald-400" />
              ) : (
                <Sparkles className="mt-[5px] h-3.5 w-3.5 shrink-0 text-amber-300" />
              )}
              <span className="text-slate-300">
                {line.kind === 'sparkle' ? (
                  <>
                    <span className="text-slate-300">Generated </span>
                    <span className="font-semibold text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.55)]">
                      DEPENDENCY_EXIT_CAPSULE.md
                    </span>
                    <span className="text-slate-300">!</span>
                  </>
                ) : (
                  line.text
                )}
              </span>
            </div>
          ))}

          {allVisible ? (
            <div className="flex items-center gap-2 whitespace-nowrap pt-0.5">
              <span className="select-none text-emerald-500">$</span>
              <Caret />
            </div>
          ) : null}
        </div>
      </div>
    </TerminalWindow>
  )
}
