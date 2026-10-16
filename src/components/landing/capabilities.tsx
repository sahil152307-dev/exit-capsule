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
    <code className="rounded border border-[#30363d] bg-[#0d1117] px-1.5 py-0.5 font-mono text-[0.82em] text-[#79c0ff]">
      {children}
    </code>
  )
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-[13.5px] leading-relaxed text-[#8b949e]">
      <ChevronRight className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[#484f58]" />
      <span>{children}</span>
    </li>
  )
}

interface Feature {
  icon: LucideIcon
  title: string
  body: ReactNode
}

const FEATURES: Feature[] = [
  {
    icon: Search,
    title: 'Real Manifest & AST Code Scanner',
    body: (
      <>
        <Bullet>
          Parses <Chip>requirements.txt</Chip> (including <Chip>-r</Chip> refs &amp; inline
          comments), PEP 621 <Chip>pyproject.toml</Chip> (Poetry &amp; optional deps), and{' '}
          <Chip>setup.py</Chip>.
        </Bullet>
        <Bullet>
          Walks all <Chip>.py</Chip> files using Python&apos;s built-in <Chip>ast</Chip> module,
          mapping distribution names to top-level imports (<Chip>pyyaml ↔ yaml</Chip>,{' '}
          <Chip>pillow ↔ PIL</Chip>).
        </Bullet>
        <Bullet>
          Categorizes dependencies as <span className="text-[#3fb950]">Active</span>,{' '}
          <span className="text-[#e3b341]">Unused</span>, or{' '}
          <span className="text-[#ff7b72]">Undeclared</span>.
        </Bullet>
      </>
    ),
  },
  {
    icon: FlaskConical,
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
          Every claim in the report is backed by an execution you can re-run and audit
          yourself.
        </Bullet>
      </>
    ),
  },
  {
    icon: Bot,
    title: 'Gemini AI Orchestrator & Fallback',
    body: (
      <>
        <Bullet>
          Integrates with the Google GenAI SDK (<Chip>google-genai</Chip>) to evaluate technical
          debt &amp; propose step-by-step modernization roadmaps.
        </Bullet>
        <Bullet>
          Built-in offline fallback: an embedded modernization engine when no API key is
          provided.
        </Bullet>
        <li className="mt-3 flex flex-wrap items-center gap-1.5">
          {[
            ['requests', 'httpx'],
            ['pytz', 'zoneinfo'],
            ['marshmallow', 'pydantic'],
          ].map(([from, to]) => (
            <span
              key={from}
              className="inline-flex items-center gap-1.5 rounded border border-[#30363d] bg-[#0d1117] px-2 py-1 font-mono text-[11px]"
            >
              <span className="text-[#8b949e]">{from}</span>
              <ArrowRight className="h-3 w-3 text-[#484f58]" />
              <span className="text-[#3fb950]">{to}</span>
            </span>
          ))}
        </li>
      </>
    ),
  },
  {
    icon: FileCheck2,
    title: 'Verifiable Exit Capsule Report',
    body: (
      <>
        <Bullet>
          Compiles all findings into a clean, structured{' '}
          <Chip>DEPENDENCY_EXIT_CAPSULE.md</Chip> inside your project root.
        </Bullet>
        <Bullet>
          Human-readable Markdown with inventory tables, test evidence, and prioritized
          migration steps.
        </Bullet>
        <Bullet>
          Commit it, diff it across branches, or feed it into your CI pipeline as an artifact.
        </Bullet>
      </>
    ),
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Features"
          description="Four production-grade engines working in concert — from raw manifest parsing to AI-assisted migration planning. Everything real, nothing simulated."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: (i % 2) * 0.07, ease: 'easeOut' }}
              className="rounded-md border border-[#30363d] bg-[#161b22] p-6 transition-colors hover:border-[#3d444d] hover:bg-[#1c2129]"
            >
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#30363d] bg-[#0d1117]">
                <feature.icon className="h-[18px] w-[18px] text-[#79c0ff]" />
              </div>
              <h3 className="text-[15.5px] font-semibold tracking-tight text-[#f0f6fc]">
                {feature.title}
              </h3>
              <ul className="mt-3.5 space-y-2.5">{feature.body}</ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
