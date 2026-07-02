'use client';

import { getHeroContent } from '@/lib/content';
import ProcessStepper from './ProcessStepper';
import { useUser } from '@/contexts/UserContext';

export default function Hero() {
  const heroContent = getHeroContent();
  const { firstName, isLoading } = useUser();

  const title = firstName
    ? `Hey ${firstName}, plan your next engagement`
    : heroContent.title;

  return (
    <section className="relative pt-36 pb-4 overflow-hidden">
      {/* Stripe-style gradient mesh - top right */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[500px] opacity-40 pointer-events-none haze-drift-2"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, #FF6B35 0%, transparent 50%), radial-gradient(ellipse at 90% 60%, #635BFF 0%, transparent 50%), radial-gradient(ellipse at 50% 10%, #00D4FF 0%, transparent 40%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="container-max section-padding text-center mb-12 relative z-10">
        <p className="overline mb-5">Salesforce AI Centre London</p>
        <h1 className={`font-sans font-bold text-display gradient-text max-w-4xl mx-auto transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {title}
        </h1>
        {heroContent.subtitle && (
          <p className="text-lg text-ink-secondary mt-5 max-w-lg mx-auto leading-relaxed">
            {heroContent.subtitle}
          </p>
        )}
      </div>

      <ProcessStepper />
    </section>
  );
}
