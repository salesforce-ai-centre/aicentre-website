/**
 * Plan page — redesigned light theme.
 *
 * Two-column hero (text + Slack workflow screenshot) with a navy footer bar.
 * Figma frame 14:712. Routed at /plan-engagement (the nav "Plan" target).
 *
 * Note: this replaces the previous engagement-planning page for now, per the
 * new design. The old version remains in git history.
 */

import Navigation from '@/components/Navigation';
import PlanHero from '@/components/plan/PlanHero';
import SiteFooter from '@/components/ui/SiteFooter';

export const metadata = {
  title: 'Plan your visit | AI Centre',
  description:
    'Plan your visit to the AI Centre — start your request via our Slack workflow.',
};

export default function PlanPage() {
  return (
    <main
      className="page-gradient flex min-h-screen flex-col overflow-x-hidden"
      style={
        {
          '--page-gradient':
            'linear-gradient(0deg, #00B3FF 0%, #90D0FE 21.42%, #EAF5FE 68.72%, #DEF9F3 100%)',
        } as React.CSSProperties
      }
    >
      <Navigation />
      <div className="flex flex-1 items-center">
        <PlanHero />
      </div>
      <SiteFooter />
    </main>
  );
}
