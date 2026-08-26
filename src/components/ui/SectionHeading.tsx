/**
 * SectionHeading — centred navy title with an optional subtitle line.
 *
 * Used by the hero titles and every section header ("Meet the team",
 * "Activations", "Workshops", "Spaces") on the redesigned pages.
 * Figma: heading 56px Avant Garde Demi, subtitle 24px Salesforce Sans,
 * both navy (#001e5b) centred on the light background.
 *
 * AIC2-132 — part of the Design System epic (AIC2-126).
 */

import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  /** Render level for the title — defaults to h2 (use h1 for the hero). */
  as?: 'h1' | 'h2';
  /** Extra classes for the title element (e.g. relax leading on a two-line hero). */
  titleClassName?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  className = '',
  as: Tag = 'h2',
  titleClassName = '',
}: SectionHeadingProps) {
  return (
    <div className={`text-center text-navy ${className}`.trim()}>
      <Tag
        className={`font-heading font-semibold leading-tight text-3xl sm:text-4xl lg:text-[56px] ${titleClassName}`.trim()}
      >
        {title}
      </Tag>
      {subtitle && (
        <p className="font-sans mx-auto mt-4 max-w-xl text-lg sm:text-xl lg:text-2xl text-navy/90">
          {subtitle}
        </p>
      )}
    </div>
  );
}
