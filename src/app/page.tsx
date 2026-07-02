import Hero from '@/components/Hero'
import Navigation from '@/components/Navigation'
import AIRecommendation from '@/components/AIRecommendation'
import ContactBanner from '@/components/ContactBanner'
import MyEvents from '@/components/MyEvents'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <MyEvents />
      <AIRecommendation />
      <ContactBanner />
    </main>
  )
}
