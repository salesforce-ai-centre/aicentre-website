import Navigation from '@/components/Navigation';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import { getUserSession } from '@/lib/user-session';
import { AgendaBuilderEmbed } from './AgendaBuilderEmbed';

export default async function AgendaBuilderPage() {
  let sfToken: string | null = null;
  let sfInstanceUrl: string | null = null;
  let userEmail: string | null = null;

  try {
    sfToken = await getSalesforceAccessToken();
    sfInstanceUrl = getSalesforceDomainUrl();
  } catch (err) {
    console.error('Failed to get SF token for agenda embed:', err);
  }

  const session = await getUserSession();
  if (session) {
    userEmail = session.email;
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 pt-24">
        <AgendaBuilderEmbed sfToken={sfToken} sfInstanceUrl={sfInstanceUrl} userEmail={userEmail} />
      </div>
    </main>
  );
}
