/**
 * Button — shared primary CTA for the redesigned light-theme pages.
 *
 * Figma: `Button` instance (node 7:60 solid, 27:1335 outline) used for
 * "Request to visit", "Explore the centre", "Plan your visit", plus the
 * Experiences hero filter pills.
 *
 * Renders as an anchor when `href` is provided, otherwise a <button>.
 * AIC2-131 — part of the Design System epic (AIC2-126).
 */

import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'solid' | 'outline' | 'pill';

const variants: Record<Variant, string> = {
  // Solid brand-blue pill with white label (Figma node 7:60).
  solid: styles.solid,
  // White with brand border + brand label — inverted CTA (Figma node 27:1335).
  outline: styles.outline,
  // Rounded filter pill used by the Experiences section switcher.
  pill: styles.pill,
};

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** Only meaningful for the `pill` variant — drives the active styling. */
  active?: boolean;
};

type AnchorProps = CommonProps & {
  href: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'className'>;

type NativeButtonProps = CommonProps & {
  href?: undefined;
} & Omit<ComponentPropsWithoutRef<'button'>, 'className'>;

export type ButtonProps = AnchorProps | NativeButtonProps;

export default function Button(props: ButtonProps) {
  const { variant = 'solid', children, className = '', active, ...rest } = props;
  const classes = `${styles.base} ${variants[variant]} ${className}`.trim();

  if (props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorProps;
    return (
      <Link
        href={href}
        className={classes}
        data-active={variant === 'pill' ? Boolean(active) : undefined}
        {...anchorRest}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      data-active={variant === 'pill' ? Boolean(active) : undefined}
      {...(rest as NativeButtonProps)}
    >
      {children}
    </button>
  );
}
