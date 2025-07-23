import { getSalesforceAccessToken, getSalesforceBaseUrl, getSalesforceDomainUrl } from '@/lib/salesforce-auth';

export async function getAllRecords(kind: string, limit: number = 20): Promise<any[]> {
  const accessToken = await getSalesforceAccessToken();
  const url = `${getSalesforceDomainUrl()}/services/data/v64.0/queryAll?q=SELECT+FIELDS(ALL)+FROM+${kind}+LIMIT+${limit}`;
  const options = { headers: { Authorization: `Bearer ${accessToken}` } };
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Salesforce data error (${response.status}): ${errorText}`);
  }
  const data = await response.json();
  return data.records;
}