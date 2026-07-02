import { getSiteConfig } from '@/lib/content';
import Link from 'next/link';

export default function ContactBanner() {
  const siteConfig = getSiteConfig();

  return (
    <div className="bg-surface-muted border-y border-border py-5">
      <div className="container-max section-padding">
        <div className="text-center text-ink">
          <div className="text-sm font-medium flex items-center justify-center space-x-3">
            <span className="text-ink-secondary">Ready to plan a customer engagement?</span>
            <Link
              href="/request"
              className="text-accent font-semibold hover:underline"
            >
              Submit a request
            </Link>
          </div>
          <div className="text-xs text-ink-tertiary mt-1">
            {siteConfig.contactInfo.supportDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
