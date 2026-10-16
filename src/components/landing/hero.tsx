'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check, Github } from 'lucide-react'
import { CopyButton } from './copy-button'
import { HeroTerminals } from './hero-terminal'

const PIP_COMMAND = 'pip install exit-capsule'
const GITHUB_URL = 'https://github.com/sahil152307-dev/exit-capsule'

const TRUST_TICKS = ['No mock data', 'Subprocess-verified results', 'Works offline without an API key']

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-[#30363d] bg-[#0d1117] px-1.5 py-0.5 font-mono text-[0.82em] text-[#79c0ff]">
      {children}
    </code>
  )
}

export function Hero() {
  return (
    <section className="px-4 pt-14 pb-16 sm:px-6 lg:pt-20 lg:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[45fr_55fr] lg:gap-14">
        {/* Left — copy */}
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-[#30363d] bg-[#161b22] px-3.5 py-1.5 text-[13px] text-[#8b949e]"
          >
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3fb950] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3fb950]" />
            </span>
            <span className="font-medium text-[#c9d1d9]">Live on PyPI</span>
            <span className="text-[#30363d]" aria-hidden>
              |
            </span>
            <span className="font-mono text-[12px]">v1.0.0</span>
            <span className="text-[#30363d]" aria-hidden>
              |
            </span>
            <span>Production-Ready CLI Tool</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06, ease: 'easeOut' }}
            className="mt-5 text-4xl leading-[1.08] font-bold tracking-[-0.025em] text-[#f0f6fc] sm:text-5xl lg:text-[52px]"
          >
            <span className="text-[#3fb950]">Zero-Hallucination</span> Dependency Analysis &amp;
            AI Modernization
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
            className="mt-5 text-[16.5px] leading-relaxed text-[#8b949e]"
          >
            Perform real <Chip>AST</Chip> import mapping, manifest auditing, sandbox{' '}
            <Chip>Pytest</Chip> verification, and <Chip>Gemini AI</Chip> migration roadmaps —
            straight from your terminal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <a
              href="#usage"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#2ea043] bg-[#238636] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2ea043] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388bfd]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>

            <div className="inline-flex items-center overflow-hidden rounded-md border border-[#30363d] bg-[#0d1117]">
              <code className="px-3.5 py-2 font-mono text-[13px] text-[#c9d1d9]">
                <span className="mr-1.5 select-none text-[#6e7681]">$</span>
                {PIP_COMMAND}
              </code>
              <span className="h-full border-l border-[#30363d]" aria-hidden />
              <CopyButton
                value={PIP_COMMAND}
                aria-label="Copy pip install command"
                className="h-[38px] w-9 rounded-none border-0"
                copiedClassName="border-0 bg-[#238636]/15 text-[#3fb950]"
              />
            </div>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm font-medium text-[#c9d1d9] transition-colors hover:border-[#8b949e] hover:bg-[#1c2129] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388bfd]"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {TRUST_TICKS.map((tick) => (
              <li key={tick} className="flex items-center gap-1.5 text-[12.5px] text-[#6e7681]">
                <Check className="h-3.5 w-3.5 text-[#3fb950]" />
                {tick}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right — animated terminal stack */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
        >
          <HeroTerminals />
        </motion.div>
      </div>
    </section>
  )
}
