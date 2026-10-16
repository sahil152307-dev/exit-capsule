'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Clipboard hook with legacy fallback + auto-reset "copied" state. */
export function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        // Legacy fallback for non-secure contexts
        const el = document.createElement('textarea')
        el.value = text
        el.setAttribute('readonly', '')
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      }
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), timeout)
    },
    [timeout]
  )

  return { copied, copy }
}

interface CopyButtonProps {
  value: string
  /** Base classes (sizing etc.) applied in both states. */
  className?: string
  /** Classes applied while idle — defaults to the dark glass style. */
  idleClassName?: string
  /** Classes applied after copying — defaults to the emerald feedback style. */
  copiedClassName?: string
  label?: string
  'aria-label'?: string
}

export function CopyButton({
  value,
  className,
  idleClassName,
  copiedClassName,
  label,
  ...aria
}: CopyButtonProps) {
  const { copied, copy } = useCopy()
  return (
    <button
      type="button"
      onClick={() => void copy(value)}
      aria-label={aria['aria-label'] ?? (copied ? 'Copied to clipboard' : 'Copy to clipboard')}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400',
        copied
          ? (copiedClassName ??
              'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_16px_-2px_rgba(16,185,129,0.5)]')
          : (idleClassName ??
              'border-white/10 bg-white/[0.04] text-slate-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300'),
        className
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {label ? (
        <span className="text-xs">
          {copied ? 'Copied!' : label}
        </span>
      ) : null}
    </button>
  )
}
