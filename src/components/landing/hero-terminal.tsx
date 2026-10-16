'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { TerminalWindow } from './terminal-window'

/* ------------------------------------------------------------------ */
/* Real `exit-capsule scan` session — reproduced 1:1 from the actual   */
/* PowerShell run against the remote GitHub repository.               */
/* ------------------------------------------------------------------ */

const PROMPT = 'PS C:\\Users\\kiran>'
const BIN = 'exit-capsule scan '
const URL = 'https://github.com/NonHumanPerson/H26_ShadowGarden_exit-capsule'
const COMMAND = BIN + URL
const REPO = 'H26_ShadowGarden_exit-capsule'
const MD_PATH = 'C:\\Users\\kiran\\H26_ShadowGarden_exit-capsule_DEPENDENCY_EXIT_CAPSULE.md'

const TYPE_MS = 24

const RISK_TEXT = 'Missing from manifests (runtime ImportError)'

const AT_RISK_ROWS = [
  { pkg: 'repo-scanner', usage: 'scripts\\run_capsule.py:32' },
  { pkg: 'test-runner', usage: 'scripts\\run_capsule.py:33' },
  { pkg: 'tomli', usage: 'scripts\\repo_scanner.py:13' },
] as const

/* Column widths (ch) measured from the real CLI output:
   15ch package · 13ch status · 47ch risk · usage tail  */
const COL_PKG = 'w-[15ch] shrink-0'
const COL_STATUS = 'w-[13ch] shrink-0'
const COL_RISK = 'w-[47ch] shrink-0'

function Caret() {
  return (
    <span
      aria-hidden
      className="animate-caret ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] bg-[#8b949e]"
    />
  )
}

function Blank() {
  return <div>&nbsp;</div>
}

function CloneLines() {
  return (
    <>
      <div className="whitespace-nowrap">
        <span className="text-[#79c0ff]">Cloning remote repository: </span>
        <span className="text-[#a5d6ff]">{URL}</span>
        <span className="text-[#3fb950]"> ➜</span>
      </div>
      <div className="whitespace-nowrap text-[#c9d1d9]">{REPO}</div>
      <Blank />
    </>
  )
}

function DoneLine() {
  return (
    <>
      <div className="whitespace-nowrap">
        <span className="font-semibold text-[#3fb950]">Done!</span>
        <span className="text-[#c9d1d9]"> Here&#39;s the Dependency Exit Capsule for {REPO}:</span>
      </div>
      <Blank />
    </>
  )
}

function SummaryBlock() {
  return (
    <>
      <div className="whitespace-nowrap font-semibold text-[#c9d1d9]">📊 Summary</div>
      <div className="whitespace-nowrap">
        <span className="text-[#8b949e]">3 dependencies scanned</span>
        <span className="text-[#484f58]"> | </span>
        <span className="text-[#f85149]">3 at-risk</span>
        <span className="text-[#484f58]"> | </span>
        <span className="text-[#8b949e]">Python project</span>
      </div>
    </>
  )
}

function AtRiskHeader() {
  return (
    <>
      <Blank />
      <div className="whitespace-nowrap font-semibold text-[#c9d1d9]">
        🔴 Critical At-Risk Dependencies
      </div>
      <Blank />
    </>
  )
}

function TableHeader() {
  return (
    <div className="pl-[2ch]">
      <div className="flex whitespace-nowrap text-[#8b949e]">
        <span className={COL_PKG}>Package</span>
        <span className={COL_STATUS}>Status</span>
        <span className={COL_RISK}>Risk</span>
        <span>Usage</span>
      </div>
      <div className="whitespace-nowrap leading-[1.4] text-[#30363d]">
        {'─'.repeat(76)}
      </div>
    </div>
  )
}

function AtRiskRow({ row }: { row: (typeof AT_RISK_ROWS)[number] }) {
  return (
    <div className="flex whitespace-nowrap pl-[2ch]">
      <span className={`${COL_PKG} text-[#c9d1d9]`}>{row.pkg}</span>
      <span className={`${COL_STATUS} text-[#e3b341]`}>Undeclared</span>
      <span className={`${COL_RISK} text-[#8b949e]`}>{RISK_TEXT}</span>
      <span className="text-[#79c0ff]">{row.usage}</span>
    </div>
  )
}

function TestStatusBlock() {
  return (
    <>
      <Blank />
      <Blank />
      <div className="whitespace-nowrap font-semibold text-[#c9d1d9]">🧪 Test Status</div>
      <div className="whitespace-nowrap">
        <span className="text-[#6e7681]">- </span>
        <span className="text-[#c9d1d9]">Baseline skipped</span>
        <span className="text-[#6e7681]"> - </span>
        <span className="text-[#8b949e]">Run with </span>
        <span className="text-[#79c0ff]">--verify</span>
        <span className="text-[#8b949e]"> to execute live pytest suite</span>
      </div>
    </>
  )
}

function MigrationBlock() {
  return (
    <>
      <Blank />
      <div className="whitespace-nowrap font-semibold text-[#c9d1d9]">🎯 Migration Priorities</div>
      <div className="whitespace-nowrap">
        <span className="text-[#6e7681]">&nbsp;1. </span>
        <span className="text-[#c9d1d9]">Pin undeclared dependencies</span>
        <span className="text-[#3fb950]"> ➜ </span>
        <span className="text-[#8b949e]">Add repo-scanner, test-runner, tomli to manifests</span>
      </div>
    </>
  )
}

function SavedLine() {
  return (
    <>
      <Blank />
      <div className="whitespace-nowrap">
        <span className="text-[#c9d1d9]">📄 Detailed capsule report saved to: </span>
        <span className="font-semibold text-[#3fb950]">{MD_PATH}</span>
      </div>
    </>
  )
}

function TipLine() {
  return (
    <div className="whitespace-nowrap">
      <span className="text-[#8b949e]">💡 Tip: See </span>
      <span className="text-[#d2a8ff]">AI_INTEGRATION_GUIDE.md</span>
      <span className="text-[#8b949e]"> to unlock Gemini AI code refactoring diffs.</span>
    </div>
  )
}

export function ScanTerminal() {
  const [typed, setTyped] = useState(0)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= COMMAND.length; i++) {
      timers.push(setTimeout(() => setTyped(i), 400 + TYPE_MS * i))
    }
    /* stage waits: clone · done · summary · red head · table head · 3 rows ·
       test · migration · saved · tip · final prompt */
    const waits = [520, 430, 470, 430, 320, 180, 180, 180, 430, 430, 440, 380, 700]
    let t = 400 + TYPE_MS * COMMAND.length + 600
    waits.forEach((w, i) => {
      t += w
      timers.push(setTimeout(() => setStage(i + 1), t))
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  const typing = typed < COMMAND.length

  const stages: ReactNode[] = [
    <CloneLines key="clone" />,
    <DoneLine key="done" />,
    <SummaryBlock key="summary" />,
    <AtRiskHeader key="head" />,
    <TableHeader key="thead" />,
    <AtRiskRow key="r0" row={AT_RISK_ROWS[0]} />,
    <AtRiskRow key="r1" row={AT_RISK_ROWS[1]} />,
    <AtRiskRow key="r2" row={AT_RISK_ROWS[2]} />,
    <TestStatusBlock key="test" />,
    <MigrationBlock key="mig" />,
    <SavedLine key="saved" />,
    <TipLine key="tip" />,
    <div key="prompt" className="flex items-center gap-2 whitespace-nowrap pt-0.5">
      <span className="select-none text-[#6e7681]">{PROMPT}</span>
      <Caret />
    </div>,
  ]

  return (
    <TerminalWindow title="PowerShell — C:\Users\kiran">
      <div className="scrollbar-slim overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.75] sm:px-5 sm:text-[12.5px]">
        <div className="sr-only" aria-live="polite">
          exit-capsule scan cloned the remote GitHub repository and generated its Dependency Exit
          Capsule: 3 dependencies scanned, 3 at-risk — repo-scanner, test-runner and tomli are
          undeclared, missing from manifests with runtime ImportError. Baseline tests skipped; run
          with --verify for the live pytest suite. Migration priority: pin the undeclared
          dependencies. Detailed report saved to H26_ShadowGarden_exit-capsule_DEPENDENCY_EXIT_CAPSULE.md.
          See AI_INTEGRATION_GUIDE.md for Gemini AI code refactoring diffs.
        </div>

        <div className="flex items-start gap-2 whitespace-nowrap">
          <span className="select-none text-[#6e7681]">{PROMPT}</span>
          <span className="text-[#c9d1d9]">
            {BIN.slice(0, Math.min(typed, BIN.length))}
            <span className="text-[#a5d6ff]">{URL.slice(0, Math.max(0, typed - BIN.length))}</span>
            {typing ? <Caret /> : null}
          </span>
        </div>

        <div aria-hidden>
          {stages.slice(0, stage).map((s) => s)}
        </div>
      </div>
    </TerminalWindow>
  )
}

export function HeroTerminals() {
  return (
    <div className="flex flex-col">
      <ScanTerminal />
    </div>
  )
}
