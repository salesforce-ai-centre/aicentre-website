/**
 * UI block contract for the "Ask AI Centre" answer surface.
 *
 * A `Block[]` is the shape an answer is assembled from — real site
 * components rendered via `BlockRenderer`, not a wall of prose. See
 * docs/adr-ask-ai-blocks.md (AIC2-151) for the decisions behind this
 * contract, and `src/components/blocks/` (AIC2-152) for the renderer.
 */

import type { Experience, Space, TeamMember, Testimonial, Workshop } from './content';

export type CardVariant = 'workshop' | 'experience' | 'space' | 'team' | 'testimonial';

export interface CardDataByVariant {
  workshop: Workshop;
  experience: Experience;
  space: Space;
  team: TeamMember;
  testimonial: Testimonial;
}

export interface TextBlock {
  type: 'text';
  markdown: string;
}

export interface SectionHeadingBlock {
  type: 'sectionHeading';
  title: string;
  subtitle?: string;
}

export type CardBlock = {
  [V in CardVariant]: { type: 'card'; variant: V; data: CardDataByVariant[V] };
}[CardVariant];

export type CarouselBlock = {
  [V in CardVariant]: { type: 'carousel'; variant: V; items: CardDataByVariant[V][] };
}[CardVariant];

export interface CtaWellBlock {
  type: 'ctaWell';
  heading: string;
  body?: string;
  buttonLabel: string;
  href: string;
}

export type Block =
  | TextBlock
  | SectionHeadingBlock
  | CardBlock
  | CarouselBlock
  | CtaWellBlock;
