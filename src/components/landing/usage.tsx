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
      'Scan a target repository, display the full formatted report right in your CLI, and save DEPENDENCY_EXIT_CAPSULE.md to the project root.',
    command: 'exit-capsule scan /path/to/target-repo',
  },
  {
    id: 'remote',
    label: 'Remote Git',
    icon: GitBranch,
    description:
      'Scan any remote Git repository without manual cloning — the agent fetches, analyzes and reports in a single command.',
    command: 'exit-capsule scan https://github.com/jamiepine/voicebox.git',
  },
  {
    id: 'show',
    label: 'Show Report',
    icon: FileText,
    description:
      'Instantly view any previously generated capsule in beautiful terminal markdown — works in PowerShell, CMD, iTerm and Claude Code.',
    command: 'exit-capsule show DEPENDENCY_EXIT_CAPSULE.md',
  },
  {
    id: 'verify',
    label: 'Pytest Verify',
    icon: FlaskConical,
    description:
      'Run the test suite inside the target repository, measure execution time, capture exit codes, and include stdout/stderr traces in the capsule.',
    command: 'exit-capsule scan . --verify',
  },
  {
    id: 'gemini',
    label: 'Gemini AI',
    icon: Sparkles,
    description:
      'Attach a Google Gemini API key to unlock technical-debt evaluation and step-by-step modernization roadmaps.',
    command: 'exit-capsule scan . --verify --api-key "YOUR_GEMINI_API_KEY"',
  },
  {
    id: 'json',
    label: 'CI/CD JSON',
    icon: Braces,
    description:
      'Output scan results as raw JSON for CI/CD pipelines, dependency dashboards and automated quality gates.',
    command: 'exit-capsule scan . --json',
  },
]

/** Token-level syntax coloring: binary white, flags blue, strings light blue. */
function HighlightedCommand({ command }: { command: string }) {
  const tokens = command.match(/("[^"]*"|[^\s]+)/g) ?? []
  return (
    <>
      {tokens.map((token, i) => {
        let color = 'text-[#c9d1d9]'
        if (token.startsWith('--')) color = 'text-[#79c0ff]'
        else if (token.startsWith('"') && token.endsWith('"')) color = 'text-[#a5d6ff]'
        else if (token.startsWith('http')) color = 'text-[#a5d6ff]'
        else if (i === 0) color = 'font-semibold text-[#e6edf3]'
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
    <section
      id="usage"
      className="scroll-mt-20 border-t border-[#21262d] px-4 py-20 sm:px-6 lg:py-24"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          title="Quick Usage"
          description="From a local directory to a fully AI-reasoned migration plan — pick a workflow, copy the command, ship."
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-10"
        >
          <Tabs defaultValue="basic" className="gap-4">
            <TabsList className="h-auto w-full gap-1 rounded-md border border-[#30363d] bg-[#0d1117] p-1">
              {USAGE_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex h-auto flex-col items-center gap-1.5 rounded px-2 py-2.5 text-xs font-medium text-[#8b949e] transition-colors data-[state=active]:border-[#30363d] data-[state=active]:bg-[#161b22] data-[state=active]:text-[#e6edf3] hover:text-[#c9d1d9]"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {USAGE_TABS.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <div className="rounded-md border border-[#30363d] bg-[#161b22] p-5">
                  <p className="max-w-2xl text-sm leading-relaxed text-[#8b949e]">
                    {tab.description}
                  </p>
                  <div className="scrollbar-slim relative mt-4 overflow-x-auto rounded-md border border-[#30363d] bg-[#0d1117] py-3.5 pr-16 pl-4">
                    <p className="font-mono text-[13px] leading-relaxed whitespace-nowrap">
                      <span className="mr-2 select-none text-[#6e7681]">$</span>
                      <code aria-label={`Command: ${tab.command}`}>
                        <HighlightedCommand command={tab.command} />
                      </code>
                    </p>
                    <CopyButton
                      value={tab.command}
                      aria-label={`Copy ${tab.label} command`}
                      className="absolute top-1/2 right-3 h-8 w-8 -translate-y-1/2"
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
