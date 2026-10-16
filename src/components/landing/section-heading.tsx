'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionHeadingProps {
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'left'
}

export function SectionHeading({ title, description, align = 'center' }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={
        align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'
      }
    >
      <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#f0f6fc] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-[#8b949e]">{description}</p>
      ) : null}
    </motion.div>
  )
}
