import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';

interface QueryOptions {
  kind: string;
  limit?: number;
  hasOfferingStatus?: boolean;
  order?: string;
  additionalWhere?: string;
}

async function fetchSalesforceRecords(url: string): Promise<any[]> {
  const accessToken = await getSalesforceAccessToken();
  const options = { 
    headers: { 
      Authorization: `Bearer ${accessToken}` 
    } 
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Salesforce request failed:', errorText);
    throw new Error(`Salesforce data error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.records;
}

function buildQueryUrl({ 
  kind, 
  limit = 20, 
  hasOfferingStatus = false, 
  order = "", 
  additionalWhere = "" 
}: QueryOptions): string {
  const baseUrl = `${getSalesforceDomainUrl()}/services/data/v64.0/queryAll?q=`;
  const fields = "SELECT+FIELDS(ALL)";
  const fromClause = `FROM+${kind}`;
  
  const whereConditions = [];
  if (hasOfferingStatus) {
    whereConditions.push("Offering_Status__c+!=+'Inactive'");
  }
  if (additionalWhere) {
    whereConditions.push(additionalWhere);
  }
  
  const whereClause = whereConditions.length 
    ? `+WHERE+${whereConditions.join('+AND+')}` 
    : "";
    
  const orderClause = order ? `+${order}+` : "";
  const limitClause = `+LIMIT+${limit}`;

  return `${baseUrl}${fields}+${fromClause}${whereClause}${orderClause}${limitClause}`;
}

export async function getAllRecords(kind: string, limit: number = 20, hasOfferingStatus: boolean = false): Promise<any[]> {
  const url = buildQueryUrl({ kind, limit, hasOfferingStatus });
  return fetchSalesforceRecords(url);
}

export async function getSortedRecords(
  kind: string, 
  limit: number = 20, 
  hasOfferingStatus: boolean = false, 
  order: string = ""
): Promise<any[]> {
  const url = buildQueryUrl({ kind, limit, hasOfferingStatus, order });
  return fetchSalesforceRecords(url);
}