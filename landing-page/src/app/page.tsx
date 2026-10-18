import { LiveCapsule } from '@/components/landing/architecture'
import { Features } from '@/components/landing/capabilities'
import { Footer } from '@/components/landing/footer'
import { Hero } from '@/components/landing/hero'
import { Navbar } from '@/components/landing/navbar'
import { Usage } from '@/components/landing/usage'

/** Subtle animated ambient background: faint grid + slowly drifting aurora blobs. */
function BackgroundFx() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Faint blueprint grid, fading out below the hero */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,148,158,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,148,158,0.045)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black_15%,transparent_75%)]" />
      {/* Soft emerald glow, upper left of hero */}
      <div className="animate-drift-a absolute -top-44 left-[12%] h-[420px] w-[540px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
      {/* Soft cyan glow, mid right */}
      <div className="animate-drift-b absolute top-[32%] -right-48 h-[380px] w-[440px] rounded-full bg-cyan-500/[0.06] blur-[110px]" />
      {/* Soft emerald glow, bottom left */}
      <div className="animate-drift-c absolute bottom-[-12%] left-[-8%] h-[360px] w-[420px] rounded-full bg-emerald-500/[0.05] blur-[100px]" />
    </div>
  )
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0d1117] text-[#c9d1d9]">
      <BackgroundFx />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Hero />
        <Features />
        <Usage />
        <LiveCapsule />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
