export interface ProfileData {
  contact: {
    name: string;
    title: string | null;
    email: string | null;
    company: string | null;
    avatarUrl: string | null;
    timezone: string | null;
    isActive: boolean;
    coins: number;
    firstVisitDate: string | null;
  };
  passType: 'AI CENTRE TEAM' | 'EMPLOYEE' | 'GUEST PASS';
  engagement: {
    totalVisits: number;
    totalExperiences: number;
    recentVisits: Array<{
      id: string;
      eventName: string;
      eventDate: string;
      checkInTime: string | null;
      role: string | null;
    }>;
    experienceBreakdown: Array<{
      type: string;
      count: number;
      icon: string;
    }>;
    eventsHosted: number;
    eventsPresented: number;
    isVIP: boolean;
  };
  f1: {
    driverPersona: string;
    bestLapTime: string;
    topSpeed: string;
  } | null;
  turing: {
    gamesPlayed: number;
  } | null;
  trailhead: {
    rank: string;
    rankImageUrl: string | null;
    points: number;
    badges: number;
    handle: string;
  } | null;
  upcomingEvent: {
    name: string;
    date: string;
  } | null;
  insights: {
    score: string;
    label: string;
    summary: string;
  };
}
