import { Architecture } from '@/components/landing/architecture'
import { Capabilities } from '@/components/landing/capabilities'
import { Footer } from '@/components/landing/footer'
import { Hero } from '@/components/landing/hero'
import { Navbar } from '@/components/landing/navbar'
import { Usage } from '@/components/landing/usage'

/** Ambient background: blueprint grid + neon glow orbs. */
function BackgroundFx() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Blueprint grid, faded towards the bottom */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black_30%,transparent_100%)]" />
      {/* Emerald glow above the hero */}
      <div className="absolute -top-44 left-1/2 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-emerald-500/[0.09] blur-[130px]" />
      {/* Cyan glow, capabilities area */}
      <div className="absolute top-[38%] -left-44 h-[380px] w-[380px] rounded-full bg-cyan-500/[0.07] blur-[110px]" />
      {/* Emerald glow, usage area */}
      <div className="absolute top-[60%] -right-44 h-[380px] w-[380px] rounded-full bg-emerald-500/[0.06] blur-[110px]" />
      {/* Bottom fade line */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0D1117] to-transparent" />
    </div>
  )
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#0D1117] text-slate-200">
      <BackgroundFx />
      <Navbar />
      <main className="relative flex-1">
        <Hero />
        <Capabilities />
        <Usage />
        <Architecture />
      </main>
      <Footer />
    </div>
  )
}
