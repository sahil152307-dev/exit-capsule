import { LiveCapsule } from '@/components/landing/architecture'
import { Features } from '@/components/landing/capabilities'
import { Footer } from '@/components/landing/footer'
import { Hero } from '@/components/landing/hero'
import { Navbar } from '@/components/landing/navbar'
import { Usage } from '@/components/landing/usage'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0d1117] text-[#c9d1d9]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Usage />
        <LiveCapsule />
      </main>
      <Footer />
    </div>
  )
}
