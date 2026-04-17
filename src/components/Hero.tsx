import { getHeroContent } from '@/lib/content';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const heroContent = getHeroContent();

  return (
    <section className="min-h-[70vh] flex items-center justify-center relative overflow-hidden pt-20">
      {/* Hero tint — dark purple top fading into the body gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-blue-900/50 to-transparent pointer-events-none"></div>

      {/* Flying Agent Astro */}
      <div className="absolute top-28 right-24 md:right-40 z-5">
        <Image
          src="/images/AgentAstroFlying.png"
          alt="Agent Astro Flying"
          width={240}
          height={240}
          className="animate-floating opacity-80"
          loading="eager"
          quality={80}
          sizes="(max-width: 768px) 180px, 240px"
        />
      </div>

      {/* Agent Astro Character */}
      <div className="absolute bottom-10 left-20 md:left-40 z-5">
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
        <div className="animate-fade-in max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 text-white floating" style={{textShadow: '0 0 30px rgba(139, 92, 246, 0.3)'}}>
            {heroContent.title}
          </h1>
          
          {heroContent.subtitle && (
            <p className="text-lg sm:text-xl lg:text-2xl text-purple-200 mb-12 font-medium">
              {heroContent.subtitle}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href={heroContent.primaryCTA.href} className="inline-block bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl hover:shadow-purple-500 w-full sm:w-auto text-center">
              {heroContent.primaryCTA.text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}