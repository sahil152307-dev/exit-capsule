'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Bot,
  ChevronRight,
  FileCheck2,
  FlaskConical,
  Search,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { SectionHeading } from './section-heading'

function Chip({ children }: { children: ReactNode }) {
  return (
    <code className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.82em] text-cyan-300">
      {children}
    </code>
  )
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-400">
      <ChevronRight className="mt-[3px] h-3.5 w-3.5 shrink-0 text-emerald-500" />
      <span>{children}</span>
    </li>
  )
}

interface Capability {
  icon: LucideIcon
  accent: 'emerald' | 'cyan'
  title: string
  body: ReactNode
}

const CAPABILITIES: Capability[] = [
  {
    icon: Search,
    accent: 'emerald',
    title: 'Real Manifest & AST Code Scanner',
    body: (
      <>
        <Bullet>
          Parses <Chip>requirements.txt</Chip> (including <Chip>-r</Chip> refs &amp; inline
          comments), PEP 621 <Chip>pyproject.toml</Chip> (Poetry &amp; optional deps), and{' '}
          <Chip>setup.py</Chip>.
        </Bullet>
        <Bullet>
          Walks all <Chip>.py</Chip> files using Python&apos;s built-in <Chip>ast</Chip> module.
          Automatically maps distribution names to top-level import names (e.g.,{' '}
          <Chip>pyyaml ↔ yaml</Chip>, <Chip>pillow ↔ PIL</Chip>).
        </Bullet>
        <Bullet>
          Categorizes dependencies into{' '}
          <span className="font-medium text-emerald-300">Active (Used)</span>,{' '}
          <span className="font-medium text-amber-300">Unused (Bloat)</span>, and{' '}
          <span className="font-medium text-rose-300">Undeclared</span>.
        </Bullet>
      </>
    ),
  },
  {
    icon: FlaskConical,
    accent: 'cyan',
    title: 'Isolated Pytest Verification',
    body: (
      <>
        <Bullet>
          Runs actual <Chip>pytest</Chip> inside the target repository via subprocess — no mock
          data, no simulations.
        </Bullet>
        <Bullet>
          Measures execution duration, captures real exit codes, <Chip>stdout</Chip>,{' '}
          <Chip>stderr</Chip>, and test counts.
        </Bullet>
        <Bullet>
          Every claim in the report is backed by an actual execution you can re-run and audit
          yourself.
        </Bullet>
      </>
    ),
  },
  {
    icon: Bot,
    accent: 'cyan',
    title: 'Google Gemini AI Orchestrator & Fallback',
    body: (
      <>
        <Bullet>
          Integrates with the Google GenAI SDK (<Chip>google-genai</Chip>) to evaluate technical
          debt &amp; propose step-by-step modernization roadmaps.
        </Bullet>
        <Bullet>
          Built-in <span className="font-medium text-cyan-300">Offline Fallback</span>: embedded
          Python modernization engine if no API key is provided.
        </Bullet>
        <li className="mt-3 flex flex-wrap items-center gap-1.5">
          {[
            ['requests', 'httpx'],
            ['pytz', 'zoneinfo'],
            ['marshmallow', 'pydantic'],
          ].map(([from, to]) => (
            <span
              key={from}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px]"
            >
              <span className="text-slate-400">{from}</span>
              <ArrowRight className="h-3 w-3 text-emerald-400" />
              <span className="font-medium text-emerald-300">{to}</span>
            </span>
          ))}
        </li>
      </>
    ),
  },
  {
    icon: FileCheck2,
    accent: 'emerald',
    title: 'Verifiable Exit Capsule Report',
    body: (
      <>
        <Bullet>
          Compiles all findings into a clean, structured{' '}
          <Chip>DEPENDENCY_EXIT_CAPSULE.md</Chip> inside your project root.
        </Bullet>
        <Bullet>
          Human-readable Markdown with inventory tables, test evidence, and prioritized migration
          steps.
        </Bullet>
        <Bullet>
          Commit it, diff it across branches, or feed it straight into your CI pipeline as an
          artifact.
        </Bullet>
      </>
    ),
  },
]

const ACCENT_STYLES = {
  emerald: {
    icon: 'border-emerald-500/25 bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 text-emerald-400 shadow-[0_0_22px_-4px_rgba(16,185,129,0.45)]',
    hover: 'hover:border-emerald-500/35 hover:shadow-[0_0_44px_-12px_rgba(16,185,129,0.35)]',
    sheen: 'via-emerald-400/50',
  },
  cyan: {
    icon: 'border-cyan-500/25 bg-gradient-to-br from-cyan-500/15 to-emerald-500/10 text-cyan-400 shadow-[0_0_22px_-4px_rgba(6,182,212,0.45)]',
    hover: 'hover:border-cyan-500/35 hover:shadow-[0_0_44px_-12px_rgba(6,182,212,0.35)]',
    sheen: 'via-cyan-400/50',
  },
} as const

export function Capabilities() {
  return (
    <section id="capabilities" className="relative scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="core capabilities"
          title={
            <>
              Everything real.{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Nothing simulated.
              </span>
            </>
          }
          description="Four production-grade engines working in concert — from raw manifest parsing to AI-assisted migration planning."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {CAPABILITIES.map((cap, i) => {
            const accent = ACCENT_STYLES[cap.accent]
            return (
              <motion.article
                key={cap.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: (i % 2) * 0.1, ease: 'easeOut' }}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161B22]/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#161B22]/85 sm:p-7 ${accent.hover}`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${accent.sheen}`}
                />
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border">
                  <cap.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                  {cap.title}
                </h3>
                <ul className="mt-4 space-y-3">{cap.body}</ul>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
