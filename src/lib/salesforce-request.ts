import { getSalesforceAccessToken, getSalesforceBaseUrl, getSalesforceDomainUrl } from '@/lib/salesforce-auth';

export async function getAllRecords(kind: string, limit: number = 20, hasOfferingStatus: boolean = false): Promise<any[]> {
  const accessToken = await getSalesforceAccessToken();
  const offeringQuery = hasOfferingStatus ? "+WHERE+Offering_Status__c+!=+'Inactive'" : "";
  const url = `${getSalesforceDomainUrl()}/services/data/v64.0/queryAll?q=SELECT+FIELDS(ALL)+FROM+${kind}${offeringQuery}+LIMIT+${limit}`;
  const options = { headers: { Authorization: `Bearer ${accessToken}` } };
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    console.log(errorText);
    throw new Error(`Salesforce data error (${response.status}): ${errorText}`);
  }
  const data = await response.json();
  return data.records;
}