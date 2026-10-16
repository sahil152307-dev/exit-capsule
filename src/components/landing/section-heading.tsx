'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionHeadingProps {
  kicker: string
  title: ReactNode
  description?: ReactNode
}

export function SectionHeading({ kicker, title, description }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="font-mono text-xs tracking-[0.25em] text-emerald-400/90 uppercase">
        {'// '}
        {kicker}
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">{description}</p>
      ) : null}
    </motion.div>
  )
}
