'use client';

import { getEngagementTiers } from '@/lib/content';
import { CheckCircle } from 'lucide-react';

const tierStyles: Record<string, { topBorder: string; badge: string }> = {
  bronze: {
    topBorder: 'border-t-ink-tertiary',
    badge: 'bg-surface-muted text-ink-secondary',
  },
  silver: {
    topBorder: 'border-t-accent',
    badge: 'bg-accent-light text-accent',
  },
  gold: {
    topBorder: 'border-t-warm',
    badge: 'bg-warm-light text-warm',
  },
};

export default function EngagementTiers() {
  const tiers = getEngagementTiers();

  return (
    <section id="tiers" className="py-20 bg-surface-muted">
      <div className="container-max section-padding">
        <div className="text-center mb-12">
          <p className="overline mb-3">Engagement Levels</p>
          <h2 className="font-sans font-bold text-h2 text-ink">
            Choose Your Level of Support
          </h2>
          <p className="text-ink-secondary mt-3 max-w-xl mx-auto">
            From self-service to fully designed — pick what fits your customer and deal stage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const style = tierStyles[tier.id] || tierStyles.bronze;
            return (
              <div
                key={tier.id}
                className={`card p-6 border-t-[3px] ${style.topBorder} flex flex-col`}
              >
                <div className="mb-4">
                  <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${style.badge} mb-3`}>
                    {tier.name}
                  </span>
                  <h3 className="text-lg font-semibold text-ink">{tier.tagline}</h3>
                  <p className="text-ink-secondary text-sm mt-1">{tier.description}</p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border pt-4 mt-auto">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary mb-1">Your role</p>
                  <p className="text-sm text-ink-secondary">{tier.yourRole}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
