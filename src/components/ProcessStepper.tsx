'use client';

import { ExternalLink } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: "Discover",
    description: "Explore our workshops, experiences, and keynotes.",
    href: "/discover",
    actionLabel: "Browse Offerings",
    required: false,
  },
  {
    number: 2,
    title: "Choose Tier",
    description: "Understand Bronze, Silver, and Gold engagement levels.",
    href: "/tiers",
    actionLabel: "View Tiers",
    required: false,
  },
  {
    number: 3,
    title: "Build Agenda",
    description: "Plan your engagement day with our interactive builder.",
    href: "/agenda-builder",
    actionLabel: "Open Builder",
    required: false,
  },
  {
    number: 4,
    title: "Submit Request",
    description: "Send your engagement request. REWS ticket included.",
    href: "/request",
    actionLabel: "Submit Request",
    required: false,
  },
];

export default function ProcessStepper() {
  return (
    <section id="process" className="py-12 section-padding">
      <div className="container-max">
        <div className="max-w-5xl mx-auto">
          {/* Desktop: horizontal */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 relative">
            {/* Connecting line */}
            <div className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-border" />

            {steps.map((step) => (
              <div
                key={step.number}
                className={`relative flex flex-col items-center text-center rounded-2xl p-5 ${
                  step.required ? 'bg-warm-light border border-warm/20' : ''
                }`}
              >
                {/* Number circle */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-3 relative z-10 ${
                  step.required
                    ? 'bg-warm text-white'
                    : 'bg-surface-muted border border-border text-ink-secondary'
                }`}>
                  {step.number}
                </div>

                {/* Required badge */}
                {step.required && (
                  <span className="bg-warm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2">
                    Required first
                  </span>
                )}

                {/* Title */}
                <h3 className="text-ink font-semibold text-sm mb-1">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-ink-secondary text-xs mb-4 leading-relaxed">{step.description}</p>

                {/* Action link */}
                {step.href && (
                  <a
                    href={step.href}
                    target={step.href.startsWith('http') ? '_blank' : undefined}
                    rel={step.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`inline-flex items-center gap-1.5 font-semibold transition-all mt-auto ${
                      step.required
                        ? 'btn-urgent !text-xs !px-4 !py-2'
                        : step.number === 2
                          ? 'btn-primary !text-xs !px-4 !py-2'
                          : 'text-accent hover:text-accent-dark text-xs'
                    }`}
                  >
                    {step.actionLabel}
                    {step.href.startsWith('http') && <ExternalLink size={12} />}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex items-start gap-4 rounded-2xl p-4 ${
                  step.required ? 'bg-warm-light border border-warm/20' : ''
                }`}
              >
                {/* Number + line */}
                <div className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    step.required
                      ? 'bg-warm text-white'
                      : 'bg-surface-muted border border-border text-ink-secondary'
                  }`}>
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-8 bg-border mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-ink font-semibold text-sm">{step.title}</h3>
                    {step.required && (
                      <span className="bg-warm text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-ink-secondary text-xs mt-1 leading-relaxed">{step.description}</p>
                  {step.href && (
                    <a
                      href={step.href}
                      target={step.href.startsWith('http') ? '_blank' : undefined}
                      rel={step.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold mt-2 transition-colors ${
                        step.required
                          ? 'btn-urgent !text-xs !px-3 !py-1.5'
                          : step.number === 2
                            ? 'btn-primary !text-xs !px-3 !py-1.5'
                            : 'text-accent hover:text-accent-dark'
                      }`}
                    >
                      {step.actionLabel}
                      {step.href.startsWith('http') && <ExternalLink size={11} />}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
