import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/user-session';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import { ProfileData } from '@/types/profile';

const EXPERIENCE_ICONS: Record<string, string> = {
  'F1': '🏎️',
  'Turing': '🤖',
  'Hunt': '🔍',
  'Quiz': '❓',
  'Arcade': '🕹️',
  'Beam Session': '📺',
  'Escape Room': '🔐',
  'Wine Tasting': '🍷',
  'Engage': '💬',
  'Feedback': '📝',
  'Reader Tap': '📡',
  'Wearable': '⌚',
  'Touchscreen': '🖥️',
  'Other': '✨',
};

function formatLapTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = ms % 1000;
  return `${minutes}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}

function deriveInsights(totalExperiences: number): ProfileData['insights'] {
  if (totalExperiences >= 8) {
    return {
      score: '0.92',
      label: 'Highly Engaged',
      summary: 'Strong engagement pattern. Potential AI Centre champion — consider for case studies or references.',
    };
  }
  if (totalExperiences >= 4) {
    return {
      score: '0.78',
      label: 'Engaged',
      summary: 'Good engagement trajectory. Consider for upcoming premium experiences or executive briefings.',
    };
  }
  if (totalExperiences >= 1) {
    return {
      score: '0.65',
      label: 'Emerging',
      summary: 'Initial touchpoint recorded. Early-stage relationship — follow up to build engagement.',
    };
  }
  return {
    score: '—',
    label: 'Awaiting Data',
    summary: 'No engagement data yet. Time to explore the AI Centre!',
  };
}

function derivePassType(title: string | null, email: string | null): ProfileData['passType'] {
  if (title && title.toLowerCase().includes('ai centre')) return 'AI CENTRE TEAM';
  if (email && email.toLowerCase().includes('@salesforce.com')) return 'EMPLOYEE';
  return 'EMPLOYEE'; // All Slack-authenticated users are employees
}

async function sfQuery(baseUrl: string, accessToken: string, soql: string) {
  const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(soql)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Salesforce query failed: ${response.status} ${errorText}`);
  }
  return response.json();
}

export async function GET() {
  const session = await getUserSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slackUserId = session.slackUserId;
  if (!slackUserId) {
    return NextResponse.json({ error: 'No Slack ID in session' }, { status: 400 });
  }

  try {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    // Query 1: Contact core fields
    const contactQuery = `SELECT Id, Name, Title, Email, Phone, MobilePhone, Account.Name, Slack_Profile_Image_192__c, Slack_Display_Name__c, Slack_Timezone__c, Slack_Is_Active__c, Coins_Total__c, First_Visit_Date__c, Trailhead_Profile_Handle__c, Trailhead_Points__c, Trailhead_Badge_Count__c, Trailhead_Rank__c, Trailhead_Rank_Image_URL__c FROM Contact WHERE Slack_User_Id__c = '${slackUserId}' LIMIT 1`;

    const contactResult = await sfQuery(baseUrl, accessToken, contactQuery);

    if (!contactResult.records || contactResult.records.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const contact = contactResult.records[0];

    // Parallel queries for engagement data
    const [visitsResult, experiencesResult, f1Result, turingResult, upcomingResult] = await Promise.all([
      sfQuery(baseUrl, accessToken,
        `SELECT Id, Event__r.Name, Event__r.Date__c, Check_In_Time__c, Role__c FROM Event_Attendee__c WHERE Contact__r.Slack_User_Id__c = '${slackUserId}' AND Event__r.Date__c <= TODAY AND Attendance_Status__c != 'No Show' AND Event__r.Date__c != null ORDER BY Event__r.Date__c DESC LIMIT 5`
      ),
      sfQuery(baseUrl, accessToken,
        `SELECT Experience_Type__c, COUNT(Id) cnt FROM Interaction__c WHERE Event_Attendee__r.Contact__r.Slack_User_Id__c = '${slackUserId}' GROUP BY Experience_Type__c`
      ),
      sfQuery(baseUrl, accessToken,
        `SELECT Best_Lap_Time_ms__c, Driver_Persona__c, Top_Speed_kph__c, Final_Position__c FROM F1_Race_Entry__c WHERE Driver_Internal_Only__r.Slack_User_Id__c = '${slackUserId}' AND Best_Lap_Time_ms__c != null ORDER BY Best_Lap_Time_ms__c ASC LIMIT 1`
      ),
      sfQuery(baseUrl, accessToken,
        `SELECT COUNT(Id) cnt FROM TuringGame__c WHERE Responder__r.Slack_User_Id__c = '${slackUserId}' AND Status__c = 'Completed'`
      ),
      sfQuery(baseUrl, accessToken,
        `SELECT Event__r.Name, Event__r.Date__c FROM Event_Attendee__c WHERE Contact__r.Slack_User_Id__c = '${slackUserId}' AND RSVP_Status__c = 'Accepted' AND Event__r.Date__c >= TODAY ORDER BY Event__r.Date__c ASC LIMIT 1`
      ),
    ]);

    // Also get total visit count and role flags
    const totalVisitsResult = await sfQuery(baseUrl, accessToken,
      `SELECT COUNT(Id) cnt, SUM(CASE WHEN Role__c = 'Host' THEN 1 ELSE 0 END) hosted, SUM(CASE WHEN Role__c = 'Presenter' THEN 1 ELSE 0 END) presented FROM Event_Attendee__c WHERE Contact__r.Slack_User_Id__c = '${slackUserId}' AND Event__r.Date__c <= TODAY AND Attendance_Status__c != 'No Show'`
    ).catch(() => null);

    // Parse visits
    const recentVisits = (visitsResult.records || []).map((r: Record<string, any>) => ({
      id: r.Id,
      eventName: r.Event__r?.Name || 'Unknown Event',
      eventDate: r.Event__r?.Date__c || '',
      checkInTime: r.Check_In_Time__c || null,
      role: r.Role__c || null,
    }));

    // Parse experience breakdown
    const experienceBreakdown = (experiencesResult.records || []).map((r: Record<string, any>) => ({
      type: r.Experience_Type__c || 'Other',
      count: r.cnt || 0,
      icon: EXPERIENCE_ICONS[r.Experience_Type__c] || '✨',
    }));

    const totalExperiences = experienceBreakdown.reduce((sum: number, e: { count: number }) => sum + e.count, 0);

    // Parse F1
    const f1Record = f1Result.records?.[0];
    const f1 = f1Record ? {
      driverPersona: f1Record.Driver_Persona__c || 'Unknown',
      bestLapTime: formatLapTime(f1Record.Best_Lap_Time_ms__c),
      topSpeed: `${Math.round(f1Record.Top_Speed_kph__c || 0)} kph`,
    } : null;

    // Parse Turing
    const turingCount = turingResult.records?.[0]?.cnt || 0;
    const turing = turingCount > 0 ? { gamesPlayed: turingCount } : null;

    // Parse upcoming
    const upcomingRecord = upcomingResult.records?.[0];
    const upcomingEvent = upcomingRecord ? {
      name: upcomingRecord.Event__r?.Name || '',
      date: upcomingRecord.Event__r?.Date__c || '',
    } : null;

    // Parse trailhead
    const trailhead = contact.Trailhead_Rank__c ? {
      rank: contact.Trailhead_Rank__c,
      rankImageUrl: contact.Trailhead_Rank_Image_URL__c || null,
      points: contact.Trailhead_Points__c || 0,
      badges: contact.Trailhead_Badge_Count__c || 0,
      handle: contact.Trailhead_Profile_Handle__c || '',
    } : null;

    // Parse role flags from total query
    let totalVisits = recentVisits.length;
    let eventsHosted = 0;
    let eventsPresented = 0;
    if (totalVisitsResult?.records?.[0]) {
      const totals = totalVisitsResult.records[0];
      totalVisits = totals.cnt || recentVisits.length;
      eventsHosted = totals.hosted || 0;
      eventsPresented = totals.presented || 0;
    }

    // Check VIP from recent visits
    const isVIP = recentVisits.some((v: { role: string | null }) => v.role === 'VIP');

    const profileData: ProfileData = {
      contact: {
        name: contact.Name || session.name,
        title: contact.Title || null,
        email: contact.Email || session.email,
        company: contact.Account?.Name || null,
        avatarUrl: contact.Slack_Profile_Image_192__c || session.avatarUrl || null,
        timezone: contact.Slack_Timezone__c || null,
        isActive: contact.Slack_Is_Active__c || false,
        coins: contact.Coins_Total__c || 0,
        firstVisitDate: contact.First_Visit_Date__c || null,
      },
      passType: derivePassType(contact.Title, contact.Email),
      engagement: {
        totalVisits,
        totalExperiences,
        recentVisits,
        experienceBreakdown,
        eventsHosted,
        eventsPresented,
        isVIP,
      },
      f1,
      turing,
      trailhead,
      upcomingEvent,
      insights: deriveInsights(totalExperiences),
    };

    return NextResponse.json({ success: true, data: profileData });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
