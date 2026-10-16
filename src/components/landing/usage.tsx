'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Braces,
  FlaskConical,
  FolderSearch,
  FileText,
  GitBranch,
  Sparkles,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CopyButton } from './copy-button'
import { SectionHeading } from './section-heading'

interface UsageTab {
  id: string
  label: string
  icon: LucideIcon
  description: string
  command: string
}

const USAGE_TABS: UsageTab[] = [
  {
    id: 'basic',
    label: 'Basic Scan',
    icon: FolderSearch,
    description:
      'Point the scanner at any local project directory and auto-render a complete exit capsule report with dependency inventory and health scores.',
    command: 'exit-capsule scan /path/to/target-repo',
  },
  {
    id: 'remote',
    label: 'Remote Git',
    icon: GitBranch,
    description:
      'Scan any public Git repository directly — the agent clones, analyzes and reports in a single command. No manual checkout required.',
    command: 'exit-capsule scan https://github.com/jamiepine/voicebox.git',
  },
  {
    id: 'show',
    label: 'Show Report',
    icon: FileText,
    description:
      'Pretty-print an existing capsule report straight into your terminal with Rich-powered syntax highlighting and tables.',
    command: 'exit-capsule show DEPENDENCY_EXIT_CAPSULE.md',
  },
  {
    id: 'verify',
    label: 'Pytest Verify',
    icon: FlaskConical,
    description:
      'Execute the real test suite in a subprocess sandbox — capturing exit codes, timing, stdout/stderr and test counts as verifiable evidence.',
    command: 'exit-capsule scan . --verify',
  },
  {
    id: 'gemini',
    label: 'Gemini AI',
    icon: Sparkles,
    description:
      'Attach your Google Gemini API key to unlock AI-assisted technical debt evaluation and step-by-step modernization roadmaps.',
    command: 'exit-capsule scan . --verify --api-key "YOUR_GEMINI_API_KEY"',
  },
  {
    id: 'json',
    label: 'CI/CD JSON',
    icon: Braces,
    description:
      'Emit machine-readable JSON for CI pipelines, dependency dashboards and automated quality gates. Perfect for GitHub Actions.',
    command: 'exit-capsule scan . --json',
  },
]

/** Token-level syntax highlighting for a shell command. */
function HighlightedCommand({ command }: { command: string }) {
  const tokens = command.match(/("[^"]*"|[^\s]+)/g) ?? []
  return (
    <>
      {tokens.map((token, i) => {
        let color = 'text-slate-200'
        if (token.startsWith('--')) color = 'text-cyan-400'
        else if (token.startsWith('"') && token.endsWith('"')) color = 'text-amber-300'
        else if (token.startsWith('http')) color = 'text-cyan-300'
        else if (token.startsWith('/')) color = 'text-slate-300'
        else if (token.endsWith('.md') || token.endsWith('.git')) color = 'text-slate-300'
        else if (i === 0) color = 'font-semibold text-emerald-400'
        else if (i === 1) color = 'text-white'
        return (
          <span key={`${token}-${i}`} className={color}>
            {token}
            {i < tokens.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </>
  )
}

export function Usage() {
  return (
    <section id="usage" className="relative scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          kicker="quick usage"
          title={
            <>
              Six commands.{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Zero configuration.
              </span>
            </>
          }
          description="From a local directory to a fully AI-reasoned migration plan — pick a workflow, copy the command, ship."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mt-12"
        >
          <Tabs defaultValue="basic" className="gap-5">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1.5 rounded-2xl border border-white/[0.07] bg-[#161B22]/70 p-2 backdrop-blur-xl sm:grid-cols-3 lg:grid-cols-6">
              {USAGE_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex h-auto flex-col gap-1.5 rounded-xl px-2 py-2.5 text-xs font-medium text-slate-400 transition-all data-[state=active]:border-emerald-500/30 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-300 data-[state=active]:shadow-[0_0_20px_-6px_rgba(16,185,129,0.5)] hover:text-slate-200"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {USAGE_TABS.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <div className="rounded-2xl border border-white/[0.07] bg-[#161B22]/50 p-5 backdrop-blur-xl sm:p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-cyan-400/90">
                    <tab.icon className="h-3.5 w-3.5" />
                    <span className="uppercase">{tab.label}</span>
                    <span className="hidden font-mono text-slate-600 sm:inline">
                      — {tab.id === 'json' ? 'machine-readable output' : 'terminal workflow'}
                    </span>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-[15px]">
                    {tab.description}
                  </p>
                  <div className="relative mt-5 overflow-x-auto rounded-xl border border-white/10 bg-[#0D1117] p-4 pr-24 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_0_30px_-14px_rgba(16,185,129,0.4)] scrollbar-slim sm:p-5 sm:pr-28">
                    <div className="flex items-start gap-2.5 font-mono text-[13px] leading-relaxed whitespace-nowrap sm:text-sm">
                      <span className="select-none text-emerald-500" aria-hidden>
                        $
                      </span>
                      <code aria-label={`Command: ${tab.command}`}>
                        <HighlightedCommand command={tab.command} />
                      </code>
                    </div>
                    <CopyButton
                      value={tab.command}
                      aria-label={`Copy ${tab.label} command`}
                      className="absolute top-3.5 right-3.5 h-8 w-8 sm:h-9 sm:w-9"
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
