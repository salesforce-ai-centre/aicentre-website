/**
 * CtaWell — closing call-to-action section for the redesigned pages.
 *
 * A large deep-blue rounded panel with a centred white heading, supporting
 * body and a button. Appears at the bottom of both pages ("Explore the magic
 * of the AI Centre" / "Plan your visit to the AI Centre").
 *
 * Figma: brand-blue (#022ac0) panel, rounded top, white 56px Avant Garde Demi
 * heading + 24px Salesforce Sans body, inverted (white/brand) button.
 *
 * AIC2-135 — part of the Design System epic (AIC2-126).
 */

import Button from './Button';

interface CtaWellProps {
  heading: React.ReactNode;
  body?: React.ReactNode;
  buttonLabel: string;
  href: string;
  className?: string;
}

export default function CtaWell({
  heading,
  body,
  buttonLabel,
  href,
  className = '',
}: CtaWellProps) {
  return (
    <section
      className={`rounded-t-[80px] bg-brand px-6 py-20 text-center text-white sm:rounded-t-[120px] ${className}`.trim()}
    >
      <div className="container-max flex flex-col items-center gap-6">
        <h2 className="font-heading text-3xl font-semibold leading-tight sm:text-4xl lg:text-[56px]">
          {heading}
        </h2>
        {body && (
          <p className="font-sans max-w-xl text-lg text-white/90 sm:text-xl lg:text-2xl">
            {body}
          </p>
        )}
        <Button href={href} variant="outline" className="mt-2">
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}
