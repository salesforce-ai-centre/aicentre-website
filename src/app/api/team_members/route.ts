import type { TeamMember } from '@/types/content';
import { getSortedRecords } from '@/lib/salesforce-request';
import { createSalesforceRoute } from '@/lib/salesforce-route';

const transformTeamMember = (object: Record<string, any>): TeamMember => ({
  id: object["Id"],
  name: object["Name"],
  description: object["Description__c"],
  imageUrl: object["Image_URL__c"],
  role: object["Role__c"]
});

export const GET = createSalesforceRoute<TeamMember>({
  label: 'team_members',
  // Previously stubbed to [] (always 500). Restored to the real SF fetch.
  fetcher: () => getSortedRecords("AI_Team_Member__c", 20, false, "ORDER+BY+Priority__c+ASC"),
  transform: transformTeamMember,
});
