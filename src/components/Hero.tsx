import { getHeroContent } from '@/lib/content';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const heroContent = getHeroContent();

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Agentforce Background */}
      <div className="absolute inset-0">
        <Image 
          src="/images/AgentforceBackground.webp" 
          alt="Agentforce Background" 
          fill
          className="object-cover opacity-30"
          priority
          quality={60}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          style={{
            objectFit: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 bg-opacity-50 to-blue-900 bg-opacity-70"></div>
      </div>
      
      {/* Flying Agent Astro */}
      <div className="absolute top-20 right-10 md:right-20 z-5">
        <Image 
          src="/images/AgentAstroFlying.png" 
          alt="Agent Astro Flying" 
          width={200} 
          height={200}
          className="floating opacity-80"
          loading="eager"
          quality={80}
          sizes="(max-width: 768px) 150px, 200px"
        />
      </div>
      
      {/* Agent Astro Character */}
      <div className="absolute bottom-10 left-10 md:left-20 z-5">
        <Image 
          src="/images/AgentAstro.webp" 
          alt="Agent Astro" 
          width={300} 
          height={300}
          className="opacity-70 scale-x-[-1]"
          loading="lazy"
          quality={80}
          sizes="(max-width: 768px) 200px, 300px"
        />
      </div>

      <div className="relative z-10 container-max section-padding text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-black mb-5 text-white floating" style={{textShadow: '0 0 30px rgba(139, 92, 246, 0.3)'}}>
            {heroContent.title}
          </h1>
          <p className="text-xl md:text-2xl text-white text-opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            {heroContent.description}
          </p>
          
          <div className="mb-16">
            <Link href={heroContent.primaryCTA.href} className="inline-block bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl hover:shadow-purple-500">
              {heroContent.primaryCTA.text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}