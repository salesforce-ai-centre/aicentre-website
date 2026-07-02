'use client';

import { useEventSection } from '@/hooks/useEventSection';
import type { EventAccount, EventOpportunity } from '@/types/events';

interface AccountsData {
  accounts: EventAccount[];
  opportunities: EventOpportunity[];
}

export default function AccountsSection({ eventId }: { eventId: string }) {
  const { data, isLoading, error } = useEventSection<AccountsData>(eventId, 'accounts', true);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2].map((i) => <div key={i} className="h-10 bg-surface-muted rounded-lg" />)}
      </div>
    );
  }

  if (error) return <p className="text-xs text-red-500">{error}</p>;
  if (!data) return <p className="text-xs text-ink-tertiary">No account data</p>;

  const { accounts, opportunities } = data;

  return (
    <div className="space-y-4">
      {accounts.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide mb-2">Accounts</p>
          <div className="space-y-2">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center gap-2">
                <p className="text-sm text-ink font-medium">{account.accountName}</p>
                {account.isPrimary && (
                  <span className="text-[9px] font-semibold bg-accent-light text-accent px-1.5 py-0.5 rounded">Primary</span>
                )}
                {account.industry && (
                  <span className="text-[11px] text-ink-tertiary">{account.industry}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {opportunities.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide mb-2">Opportunities</p>
          <div className="space-y-2">
            {opportunities.map((opp) => (
              <div key={opp.id} className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-ink font-medium">{opp.opportunityName}</p>
                  {opp.stage && <p className="text-[11px] text-ink-tertiary">{opp.stage}</p>}
                </div>
                {opp.amount && (
                  <span className="text-sm font-semibold text-ink">
                    {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(opp.amount)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {accounts.length === 0 && opportunities.length === 0 && (
        <p className="text-xs text-ink-tertiary">No accounts or opportunities linked</p>
      )}
    </div>
  );
}
