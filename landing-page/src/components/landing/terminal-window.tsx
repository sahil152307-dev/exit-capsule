import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TerminalWindowProps {
  title?: string
  children: ReactNode
  className?: string
  /** Slot rendered at the right side of the title bar (badges etc.). */
  actions?: ReactNode
}

/** macOS-style window chrome: authentic traffic lights (red close / yellow
 *  minimize / green zoom) with hover glyphs, revealed while the pointer is
 *  over the window — like a real MacBook terminal. */
export function TerminalWindow({
  title,
  children,
  className,
  actions,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        'group/window overflow-hidden rounded-md border border-[#30363d] bg-[#161b22]',
        className
      )}
    >
      <div className="flex min-h-[38px] items-center gap-2 border-b border-[#30363d] bg-[#161b22] px-3.5 py-2">
        <span className="flex items-center gap-2" aria-hidden>
          {/* close — red */}
          <span className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.2)]">
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className="h-full w-full opacity-0 transition-opacity duration-150 group-hover/window:opacity-100"
            >
              <path
                d="M3.4 3.4l5.2 5.2M8.6 3.4l-5.2 5.2"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {/* minimize — yellow */}
          <span className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.2)]">
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className="h-full w-full opacity-0 transition-opacity duration-150 group-hover/window:opacity-100"
            >
              <path d="M3.4 6h5.2" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          {/* zoom — green */}
          <span className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.2)]">
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className="h-full w-full opacity-0 transition-opacity duration-150 group-hover/window:opacity-100"
            >
              <path d="M3.4 6.5V3.4h3.1z" fill="white" />
              <path d="M8.6 5.5v3.1H5.5z" fill="white" />
            </svg>
          </span>
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
