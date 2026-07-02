import Navigation from '@/components/Navigation';
import ProfileCard from '@/components/ProfileCard';

export const metadata = {
  title: 'My Profile | AI Centre',
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-surface-muted">
      <Navigation />
      <section className="pt-32 pb-16 section-padding">
        <div className="max-w-md mx-auto">
          <ProfileCard />
        </div>
      </section>
    </main>
  );
}
