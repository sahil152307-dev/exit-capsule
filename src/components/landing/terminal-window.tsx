import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TerminalWindowProps {
  title?: string
  children: ReactNode
  className?: string
  actions?: ReactNode
}

/** macOS-style terminal frame with traffic-light dots and a neon top sheen. */
export function TerminalWindow({
  title = 'bash — ~/project',
  children,
  className,
  actions,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/10 bg-[#0D1117]/95 shadow-[0_0_70px_-18px_rgba(16,185,129,0.45)] backdrop-blur-xl',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57] shadow-[0_0_8px_rgba(255,95,87,0.55)]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E] shadow-[0_0_8px_rgba(254,188,46,0.55)]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840] shadow-[0_0_8px_rgba(40,200,64,0.55)]" />
        <span className="ml-2 truncate font-mono text-xs text-slate-500">{title}</span>
        {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  )
}
