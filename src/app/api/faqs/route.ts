import type { FAQ } from '@/types/content';
import { getAllRecords } from '@/lib/salesforce-request';
import { createSalesforceRoute } from '@/lib/salesforce-route';

const transformFaq = (object: Record<string, any>): FAQ => ({
  id: object["Name"],
  question: object["Question__c"],
  answer: object["Answer__c"],
  category: object["Category__c"].toLowerCase()
});

export const GET = createSalesforceRoute<FAQ>({
  label: 'faqs',
  fetcher: () => getAllRecords("Frequently_Asked_Question__c"),
  transform: transformFaq,
});
