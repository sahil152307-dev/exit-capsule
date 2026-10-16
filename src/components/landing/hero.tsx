'use client'

import { motion } from 'framer-motion'
import { Check, ExternalLink, Package, Rocket } from 'lucide-react'
import { CopyButton } from './copy-button'
import { HeroTerminal } from './hero-terminal'

const PIP_COMMAND = 'pip install exit-capsule'

const TRUST_TICKS = [
  'Zero mock data',
  'Subprocess-verified results',
  'Works offline without an API key',
]

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="badge-glow inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border border-emerald-500/40 bg-emerald-500/[0.08] px-4 py-1.5 text-xs text-slate-300 backdrop-blur-sm">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-300">
              <Package className="h-3.5 w-3.5" />
              Live on PyPI
            </span>
            <span className="h-3 w-px bg-emerald-500/25" aria-hidden />
            <span className="font-mono text-emerald-400/90">v1.0.0</span>
            <span className="h-3 w-px bg-emerald-500/25" aria-hidden />
            <span className="text-slate-300">Production-Ready CLI Tool</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
          className="mt-7 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]"
        >
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(16,185,129,0.35)]">
            Zero-Hallucination
          </span>{' '}
          Dependency Analysis{' '}
          <span className="whitespace-nowrap">&amp;</span>{' '}
          <span className="bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent">
            AI Modernization
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: 'easeOut' }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          Perform real{' '}
          <code className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.85em] text-emerald-300">
            AST
          </code>{' '}
          import mapping, manifest auditing, sandbox{' '}
          <code className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.85em] text-emerald-300">
            Pytest
          </code>{' '}
          verification, and{' '}
          <code className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.85em] text-cyan-300">
            Gemini AI
          </code>{' '}
          migration roadmaps — straight from your terminal.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24, ease: 'easeOut' }}
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
        >
          {/* Primary: Get Started + pip install with copy */}
          <div className="inline-flex overflow-hidden rounded-xl shadow-[0_0_32px_-6px_rgba(16,185,129,0.5)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-400">
            <a
              href="#usage"
              className="group inline-flex items-center gap-2.5 bg-gradient-to-b from-emerald-400 to-emerald-500 px-5 py-3.5 text-sm font-semibold text-[#04110b] transition-all hover:from-emerald-300 hover:to-emerald-400 sm:px-6"
            >
              <Rocket className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Get Started
            </a>
            <div className="flex items-center gap-2 border-l border-emerald-600/40 bg-gradient-to-b from-emerald-500/90 to-emerald-600/90 py-3.5 pl-4 pr-2.5 sm:pl-5">
              <code className="font-mono text-[13px] font-medium text-[#04110b]/90">
                {PIP_COMMAND}
              </code>
              <CopyButton
                value={PIP_COMMAND}
                aria-label="Copy pip install command"
                className="h-7 w-7"
                idleClassName="border-[#04110b]/15 bg-[#04110b]/10 text-[#04110b]/70 hover:border-[#04110b]/25 hover:bg-[#04110b]/20 hover:text-[#04110b]"
                copiedClassName="border-[#04110b]/30 bg-[#04110b]/20 text-[#04110b] shadow-none"
              />
            </div>
          </div>

          {/* Secondary: GitHub */}
          <a
            href="https://github.com/exitkit/exit-capsule"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-slate-200 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-cyan-400/[0.07] hover:text-cyan-300 hover:shadow-[0_0_28px_-8px_rgba(6,182,212,0.5)]"
          >
            View on GitHub
            <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>

        {/* Trust ticks */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.36 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {TRUST_TICKS.map((tick) => (
            <li key={tick} className="flex items-center gap-1.5 text-xs text-slate-500">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              {tick}
            </li>
          ))}
        </motion.ul>

        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.42, ease: 'easeOut' }}
          className="mt-14 w-full max-w-2xl"
        >
          <HeroTerminal />
          <div
            aria-hidden
            className="mx-auto mt-4 h-16 max-w-lg bg-emerald-500/10 blur-[42px]"
          />
        </motion.div>
      </div>
    </section>
  )
}
