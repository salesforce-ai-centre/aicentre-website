/**
 * ContentCard — shared white card shell for the redesigned pages.
 *
 * Backs the activation / workshop / space / team cards. Composable:
 * an image area with an optional top-right badge, then title + body (or
 * arbitrary children) in the text area.
 *
 * Figma (node 27:1106 family): white, rounded-16, image wrapper 238px tall,
 * badge = white pill w/ navy text top-right, text content px-32 gap-16,
 * title 24px Avant Garde Demi navy, body 16px Salesforce Sans navy.
 *
 * AIC2-133 — part of the Design System epic (AIC2-126).
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

interface ContentCardProps {
  /** Image URL. Rendered via next/image with fill inside a fixed-height frame. */
  imageSrc?: string;
  imageAlt?: string;
  /** Optional pill shown top-right over the image (e.g. "Guided", "Self Serve"). */
  badge?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Extra content rendered in the text area below the description. */
  children?: ReactNode;
  className?: string;
}

export default function ContentCard({
  imageSrc,
  imageAlt = '',
  badge,
  title,
  description,
  children,
  className = '',
}: ContentCardProps) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-card bg-white pb-8 shadow-card ${className}`.trim()}
    >
      {imageSrc && (
        <div className="relative h-[238px] w-full shrink-0 overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {badge && (
            <span className="absolute right-4 top-4 rounded-2xl bg-white px-4 py-1.5 font-sans text-base font-bold text-navy">
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 px-8 pt-6 text-navy">
        {title && (
          <h3 className="font-heading text-2xl font-semibold">{title}</h3>
        )}
        {description && (
          <p className="font-sans text-base text-navy/90">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}
