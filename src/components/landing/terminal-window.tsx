import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TerminalWindowProps {
  title?: string
  children: ReactNode
  className?: string
  /** Slot rendered at the right side of the title bar (badges etc.). */
  actions?: ReactNode
}

/** Quiet editor-style window chrome: muted traffic lights, 1px border, no glow. */
export function TerminalWindow({
  title,
  children,
  className,
  actions,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-[#30363d] bg-[#161b22]',
        className
      )}
    >
      <div className="flex min-h-[38px] items-center gap-2 border-b border-[#30363d] bg-[#161b22] px-3.5 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-[11px] w-[11px] rounded-full bg-[#484f58]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#484f58]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#484f58]" />
        </span>
        {title ? (
          <span className="ml-1.5 truncate font-mono text-[11.5px] text-[#8b949e]">
            {title}
          </span>
        ) : null}
        {actions ? <div className="ml-auto flex items-center gap-1.5">{actions}</div> : null}
      </div>
      {children}
    </div>
  )
}
