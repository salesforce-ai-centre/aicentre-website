import type { Experience } from '@/types/content';
import { getSortedRecords } from '@/lib/salesforce-request';
import { createSalesforceRoute } from '@/lib/salesforce-route';

const transformExperience = (object: Record<string, any>): Experience => ({
  id: object["Name"],
  title: object["Title__c"],
  description: object["Description__c"],
  type: object["Type__c"].toLowerCase(),
  duration: object["Duration__c"],
  audienceSize: object["Audience_Size__c"],
  tags: object["Tags__c"]?.split(";") || [],
  category: object["Status__c"],
  isHosted: object["Is_Hosted__c"],
});

export const GET = createSalesforceRoute<Experience>({
  label: 'experiences',
  fetcher: () => getSortedRecords("Immersive_Experience__c", 20, true, "ORDER+BY+Status__c+ASC"),
  transform: transformExperience,
});
