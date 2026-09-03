import type { Space } from '@/types/content';
import { getSortedRecords } from '@/lib/salesforce-request';
import { createSalesforceRoute } from '@/lib/salesforce-route';

const transformSpace = (object: Record<string, any>): Space => ({
  id: object["Id"],
  name: object["Name"],
  description: object["Description__c"],
  imageUrl: object["Image_URL__c"],
  capacity: object["Capacity__c"],
  status: object["Status__c"]
});

export const GET = createSalesforceRoute<Space>({
  label: 'spaces',
  fetcher: () => getSortedRecords("Space__c", 20, false, "ORDER+BY+CreatedDate+ASC"),
  transform: transformSpace,
  postProcess: (spaces) => spaces.filter((space) => space.status === 'Active'),
});
