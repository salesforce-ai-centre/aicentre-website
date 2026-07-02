'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProfileData } from '@/types/profile';
import { useUser } from '@/contexts/UserContext';

const PASS_GRADIENTS = {
  'AI CENTRE TEAM': 'from-[#7c3aed] to-[#6b2fd4]',
  'EMPLOYEE': 'from-[#0d9488] to-[#0b7c72]',
  'GUEST PASS': 'from-[#4361ee] to-[#3a56d4]',
};

export default function ProfileCard() {
  const { user } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.status === 404) {
          setError('not-found');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch profile');
        const json = await res.json();
        setProfile(json.data);
      } catch {
        setError('error');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (error === 'not-found') {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#0b7c72] p-6 text-white shadow-card">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 text-2xl">
            {user?.name?.charAt(0) || '?'}
          </div>
          <h2 className="text-lg font-semibold">{user?.name || 'Unknown'}</h2>
          <p className="text-white/70 text-sm mt-2">Your Salesforce contact record hasn&apos;t been linked yet.</p>
          <p className="text-white/50 text-xs mt-1">Ask the AI Centre team to connect your profile.</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-2xl bg-surface-elevated border border-border p-6 text-center">
        <p className="text-ink-secondary text-sm">Something went wrong loading your profile.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-accent font-medium hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const gradient = PASS_GRADIENTS[profile.passType];
  const roleLabel = profile.engagement.eventsHosted > 0
    ? 'HOST'
    : profile.engagement.eventsPresented > 0
      ? 'PRESENTER'
      : profile.engagement.isVIP
        ? 'VIP'
        : null;

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Image src="/images/ai-centre-logo.png" alt="AI Centre" width={120} height={28} className="brightness-0 invert opacity-90" style={{ height: '24px', width: 'auto' }} />
        </div>
        <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase">
          {profile.passType}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Profile Section */}
        <div className="flex items-start gap-4">
          {profile.contact.avatarUrl ? (
            <div className="relative flex-shrink-0">
              <img
                src={profile.contact.avatarUrl}
                alt={profile.contact.name}
                className="w-[96px] h-[96px] rounded-xl object-cover border-2 border-white/20"
              />
              <span className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white/30 ${profile.contact.isActive ? 'bg-green-400' : 'bg-yellow-400'}`} />
            </div>
          ) : (
            <div className="w-[96px] h-[96px] rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold opacity-80">
                {profile.contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
          )}
          <div className="min-w-0 pt-1">
            <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-70">Contact</span>
            <h1 className="text-xl font-bold leading-tight mt-0.5">
              {profile.contact.name}
              {roleLabel && (
                <span className="ml-2 inline-block bg-white/20 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide align-middle">
                  {roleLabel}
                </span>
              )}
            </h1>
            {profile.contact.title && (
              <p className="text-sm text-white/70 mt-1">{profile.contact.title}</p>
            )}
            {profile.passType === 'GUEST PASS' && profile.contact.company && (
              <p className="text-sm text-white/70">{profile.contact.company}</p>
            )}
          </div>
        </div>

        {/* Stats Panel */}
        <div className="bg-black/15 rounded-xl p-4 flex items-center justify-around">
          {(profile.passType === 'EMPLOYEE' || profile.passType === 'AI CENTRE TEAM') && (
            <>
              <div className="text-center">
                <span className="block text-2xl font-bold">{profile.contact.coins}</span>
                <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-70">Coins</span>
              </div>
              <div className="w-px h-8 bg-white/20" />
            </>
          )}
          <div className="text-center">
            <span className="block text-2xl font-bold">{profile.engagement.totalVisits}</span>
            <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-70">Visits</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <span className="block text-2xl font-bold">{profile.engagement.totalExperiences}</span>
            <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-70">Experiences</span>
          </div>
        </div>

        {/* Upcoming Event */}
        {profile.upcomingEvent && (
          <div className="bg-black/10 rounded-xl p-4">
            <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-70">Upcoming</span>
            <div className="mt-1.5">
              <p className="font-semibold text-sm">{profile.upcomingEvent.name}</p>
              <p className="text-xs text-white/70 mt-0.5">
                {new Date(profile.upcomingEvent.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        )}

        {/* Visit History */}
        {profile.engagement.recentVisits.length > 0 && (
          <div className="bg-black/10 rounded-xl p-4">
            <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-70">Visit History</span>
            <div className="mt-2 space-y-2">
              {profile.engagement.recentVisits.map((visit) => (
                <div key={visit.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{visit.eventName}</p>
                    <p className="text-xs text-white/60">
                      {new Date(visit.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {visit.checkInTime && ` · ${new Date(visit.checkInTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                  </div>
                  {visit.role && (
                    <span className="text-[9px] font-bold bg-white/15 px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0 ml-2">
                      {visit.role}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Breakdown */}
        <div className="bg-black/10 rounded-xl p-4">
          <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-70">Experiences</span>
          {profile.engagement.experienceBreakdown.length > 0 ? (
            <div className="mt-2 space-y-1.5">
              {profile.engagement.experienceBreakdown.map((exp) => (
                <div key={exp.type} className="flex items-center justify-between">
                  <span className="text-sm">
                    <span className="mr-2">{exp.icon}</span>
                    {exp.type}
                  </span>
                  <span className="text-sm font-bold">{exp.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/50 mt-2">No experiences recorded yet</p>
          )}
        </div>

        {/* F1 Racing */}
        {profile.f1 && (
          <div className="bg-black/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-70">F1 Racing</span>
              <span className="text-[10px] text-white/50">Silverstone</span>
            </div>
            <p className="text-sm font-semibold mt-2">{profile.f1.driverPersona}</p>
            <div className="flex items-center gap-6 mt-2">
              <div>
                <span className="block text-lg font-bold">{profile.f1.bestLapTime}</span>
                <span className="text-[10px] text-white/60">Best Lap</span>
              </div>
              <div>
                <span className="block text-lg font-bold">{profile.f1.topSpeed}</span>
                <span className="text-[10px] text-white/60">Top Speed</span>
              </div>
            </div>
          </div>
        )}

        {/* Turing Test */}
        {profile.turing && (
          <div className="bg-black/10 rounded-xl p-4">
            <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-70">Turing Test</span>
            <div className="flex items-center gap-6 mt-2">
              <div>
                <span className="block text-lg font-bold">{profile.turing.gamesPlayed}</span>
                <span className="text-[10px] text-white/60">Games Played</span>
              </div>
            </div>
          </div>
        )}

        {/* Trailhead */}
        {profile.trailhead && (
          <div className="bg-black/10 rounded-xl p-4">
            <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-70">Trailhead</span>
            <div className="flex items-center gap-3 mt-2">
              {profile.trailhead.rankImageUrl && (
                <img src={profile.trailhead.rankImageUrl} alt={profile.trailhead.rank} className="w-10 h-10" />
              )}
              <div>
                <p className="text-sm font-semibold">{profile.trailhead.rank}</p>
                <p className="text-xs text-white/60">
                  {profile.trailhead.points.toLocaleString()} points · {profile.trailhead.badges} badges
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Insights */}
        <div className="bg-black/10 rounded-xl p-4">
          <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-70">Engagement Insights</span>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-2xl font-bold">{profile.insights.score}</span>
            <span className="text-sm font-medium text-white/80">{profile.insights.label}</span>
          </div>
          <p className="text-xs text-white/60 mt-1.5 leading-relaxed">{profile.insights.summary}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#0b7c72] text-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-pulse">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="h-6 w-28 bg-white/20 rounded" />
        <div className="h-5 w-20 bg-white/20 rounded-lg" />
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-[96px] h-[96px] rounded-xl bg-white/20" />
          <div className="space-y-2 pt-2">
            <div className="h-3 w-16 bg-white/20 rounded" />
            <div className="h-5 w-36 bg-white/20 rounded" />
            <div className="h-3 w-24 bg-white/20 rounded" />
          </div>
        </div>
        <div className="bg-black/15 rounded-xl p-4 flex items-center justify-around">
          <div className="text-center space-y-1">
            <div className="h-7 w-8 bg-white/20 rounded mx-auto" />
            <div className="h-2 w-10 bg-white/20 rounded mx-auto" />
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center space-y-1">
            <div className="h-7 w-8 bg-white/20 rounded mx-auto" />
            <div className="h-2 w-10 bg-white/20 rounded mx-auto" />
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center space-y-1">
            <div className="h-7 w-8 bg-white/20 rounded mx-auto" />
            <div className="h-2 w-10 bg-white/20 rounded mx-auto" />
          </div>
        </div>
        <div className="bg-black/10 rounded-xl p-4 space-y-2">
          <div className="h-2 w-20 bg-white/20 rounded" />
          <div className="h-4 w-full bg-white/20 rounded" />
          <div className="h-4 w-3/4 bg-white/20 rounded" />
        </div>
      </div>
    </div>
  );
}
