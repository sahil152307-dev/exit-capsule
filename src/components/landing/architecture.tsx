'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { FileCode2, FileCog, Folder, FolderGit2, Layers } from 'lucide-react'
import { SectionHeading } from './section-heading'

type TreeNode = {
  glyph: string
  name: string
  icon: LucideIcon
  nameClass: string
  iconClass: string
  comment?: string
}

const TREE: TreeNode[] = [
  {
    glyph: '',
    name: 'exitkit/',
    icon: FolderGit2,
    nameClass: 'font-semibold text-cyan-300',
    iconClass: 'text-cyan-400',
  },
  {
    glyph: '├── ',
    name: 'pyproject.toml',
    icon: FileCog,
    nameClass: 'text-amber-300',
    iconClass: 'text-amber-400/80',
    comment: 'Build config & entrypoint',
  },
  {
    glyph: '├── ',
    name: 'exit_capsule/',
    icon: Folder,
    nameClass: 'font-semibold text-cyan-300',
    iconClass: 'text-cyan-400',
  },
  {
    glyph: '│   ├── ',
    name: 'models.py',
    icon: FileCode2,
    nameClass: 'text-emerald-300',
    iconClass: 'text-emerald-400/80',
    comment: 'Data models (ScanResult, TestRunResult)',
  },
  {
    glyph: '│   ├── ',
    name: 'repo_scanner.py',
    icon: FileCode2,
    nameClass: 'text-emerald-300',
    iconClass: 'text-emerald-400/80',
    comment: 'Real manifest parser & AST visitor',
  },
  {
    glyph: '│   ├── ',
    name: 'test_runner.py',
    icon: FileCode2,
    nameClass: 'text-emerald-300',
    iconClass: 'text-emerald-400/80',
    comment: 'Real subprocess pytest runner',
  },
  {
    glyph: '│   ├── ',
    name: 'agent_orchestrator.py',
    icon: FileCode2,
    nameClass: 'text-emerald-300',
    iconClass: 'text-emerald-400/80',
    comment: 'Gemini AI & report generator',
  },
  {
    glyph: '│   └── ',
    name: 'cli.py',
    icon: FileCode2,
    nameClass: 'text-emerald-300',
    iconClass: 'text-emerald-400/80',
    comment: 'Production Typer & Rich CLI',
  },
  {
    glyph: '└── ',
    name: 'tests/',
    icon: Folder,
    nameClass: 'font-semibold text-cyan-300',
    iconClass: 'text-cyan-400',
    comment: '12 Unit & Integration tests',
  },
]

export function Architecture() {
  return (
    <section id="architecture" className="relative scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          kicker="project architecture"
          title={
            <>
              A clean, modular{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                codebase
              </span>
            </>
          }
          description="Every module has one responsibility and one job only — separation of parsing, execution, reasoning and presentation."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161B22]/60 shadow-[0_0_60px_-20px_rgba(6,182,212,0.35)] backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          {/* Window header */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3 sm:px-5">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span className="font-mono text-xs text-slate-500">
              exitkit — project structure
            </span>
            <span className="ml-auto hidden font-mono text-[11px] text-emerald-500/80 sm:inline">
              5 modules · 12 tests · 0 mocks
            </span>
          </div>

          {/* Tree */}
          <div className="p-3 font-mono text-[12.5px] leading-loose sm:p-5 sm:text-[13.5px]">
            {TREE.map((node) => (
              <div
                key={`${node.glyph}${node.name}`}
                className="group flex flex-wrap items-baseline gap-x-2 rounded-lg px-2 py-1 transition-colors duration-150 hover:bg-white/[0.035]"
              >
                <span
                  aria-hidden
                  className="select-none whitespace-pre text-slate-700 group-hover:text-slate-500"
                >
                  {node.glyph}
                </span>
                <node.icon
                  className={`h-4 w-4 shrink-0 self-center ${node.iconClass}`}
                  aria-hidden
                />
                <span className={`whitespace-nowrap ${node.nameClass}`}>{node.name}</span>

                {node.comment ? (
                  <>
                    <span
                      aria-hidden
                      className="mx-1 hidden flex-1 -translate-y-[3px] border-b border-dotted border-white/[0.08] sm:block"
                    />
                    <span className="hidden whitespace-nowrap text-xs text-slate-500 transition-colors group-hover:text-slate-400 sm:block">
                      # {node.comment}
                    </span>
                    <span className="mt-0.5 w-full pl-4 text-[11px] text-slate-600 sm:hidden">
                      # {node.comment}
                    </span>
                  </>
                ) : null}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] bg-white/[0.015] px-4 py-3 text-[11px] sm:px-5">
            {[
              ['text-cyan-400', 'Package / folder'],
              ['text-emerald-400', 'Python module'],
              ['text-amber-400/80', 'Build config'],
            ].map(([color, label]) => (
              <span key={label} className="flex items-center gap-1.5 text-slate-500">
                <span aria-hidden className={`h-2 w-2 rounded-full bg-current ${color}`} />
                {label}
              </span>
            ))}
            <span className="ml-auto hidden font-mono text-slate-600 sm:inline">
              python3.9+ · zero heavy deps
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
