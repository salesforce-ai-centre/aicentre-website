import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import type { F1RaceData } from '@/types/events';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    // Get races for this event, then entries separately
    const raceQuery = `SELECT Id, Name FROM F1_Race__c WHERE Event__c = '${id}'`;
    const raceUrl = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(raceQuery)}`;
    const raceRes = await fetch(raceUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!raceRes.ok) {
      // Object may not exist — return empty gracefully
      return NextResponse.json({ success: true, data: [] });
    }

    const raceData = await raceRes.json();
    if (!raceData.records || raceData.records.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const races: F1RaceData[] = await Promise.all(
      raceData.records.map(async (r: Record<string, any>) => {
        const entryQuery = `SELECT Id, Racer_Name__c, Driver_Persona__c, Best_Lap_Time_ms__c, Top_Speed_kph__c, Final_Position__c FROM F1_Race_Entry__c WHERE Race__c = '${r.Id}' ORDER BY Final_Position__c ASC NULLS LAST`;
        const entryRes = await fetch(`${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(entryQuery)}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        let entries: any[] = [];
        if (entryRes.ok) {
          const entryData = await entryRes.json();
          entries = (entryData.records || []).map((e: Record<string, any>) => ({
            id: e.Id,
            driverName: e.Racer_Name__c || 'Unknown',
            driverPersona: e.Driver_Persona__c,
            bestLapTime: e.Best_Lap_Time_ms__c,
            topSpeed: e.Top_Speed_kph__c,
            finalPosition: e.Final_Position__c,
          }));
        }

        return { raceId: r.Id, raceName: r.Name, entries };
      })
    );

    return NextResponse.json({ success: true, data: races });
  });
}
