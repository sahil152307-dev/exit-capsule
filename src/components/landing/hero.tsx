'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CopyButton } from './copy-button'
import { HeroTerminals } from './hero-terminal'

const PIP_COMMAND = 'pip install exit-capsule'

export function Hero() {
  return (
    <section className="border-b border-[#21262d] px-4 pt-14 pb-16 sm:px-6 lg:pt-24 lg:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[45fr_55fr] lg:gap-14">
        {/* Left — copy */}
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1 text-[13px] text-[#8b949e]"
          >
            <span className="h-2 w-2 rounded-full bg-[#a371f7]" aria-hidden />
            Powered by <span className="font-medium text-[#d2a8ff]">Gemma 4</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06, ease: 'easeOut' }}
            className="mt-5 text-4xl leading-[1.08] font-bold tracking-[-0.025em] text-[#f0f6fc] sm:text-5xl lg:text-[52px]"
          >
            Automated Dependency Resilience &amp; Safe Migrations for Open Source
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
            className="mt-5 text-[17px] leading-relaxed text-[#8b949e]"
          >
            Scan your repository, detect risky dependencies with Gemma 4, run
            automated verification tests, and generate verified Dependency Exit
            Capsules in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#live-capsule"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#2ea043] bg-[#238636] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2ea043] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388bfd]"
            >
              Explore the live demo
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
          </motion.div>
        </div>

        {/* Right — terminal stack */}
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
