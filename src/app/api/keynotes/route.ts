import type { Keynote } from '@/types/content';
import { getAllRecords } from '@/lib/salesforce-request';
import { createSalesforceRoute } from '@/lib/salesforce-route';

const transformKeynote = (object: Record<string, any>): Keynote => ({
  id: object["Name"],
  title: object["Title__c"],
  description: object["Description__c"],
  presenter: object["Presenter__c"],
  presenterRole: object["Presenter_Role__c"],
  duration: object["Duration__c"],
  audienceSize: object["Audience_Size__c"],
  topics: object["Topics__c"].split(";"),
  focusArea: object["Focus_Area__c"],
  audience: object["Audience__c"].replace(";", ", ")
});

export const GET = createSalesforceRoute<Keynote>({
  label: 'keynotes',
  fetcher: () => getAllRecords("Executive_Keynote__c", 20, true),
  transform: transformKeynote,
});
