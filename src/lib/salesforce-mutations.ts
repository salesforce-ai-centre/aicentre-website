import { getSalesforceAccessToken, getSalesforceDomainUrl } from './salesforce-auth';

const API_VERSION = 'v64.0';

export async function createSalesforceRecord(
  objectType: string,
  fields: Record<string, unknown>
): Promise<{ id: string; success: boolean }> {
  const accessToken = await getSalesforceAccessToken();
  const baseUrl = getSalesforceDomainUrl();
  const url = `${baseUrl}/services/data/${API_VERSION}/sobjects/${objectType}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fields),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create ${objectType}: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return { id: data.id, success: true };
}

export async function updateSalesforceRecord(
  objectType: string,
  recordId: string,
  fields: Record<string, unknown>
): Promise<{ success: boolean }> {
  const accessToken = await getSalesforceAccessToken();
  const baseUrl = getSalesforceDomainUrl();
  const url = `${baseUrl}/services/data/${API_VERSION}/sobjects/${objectType}/${recordId}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fields),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update ${objectType}/${recordId}: ${response.status} ${errorText}`);
  }

  return { success: true };
}

export async function deleteSalesforceRecord(
  objectType: string,
  recordId: string
): Promise<{ success: boolean }> {
  const accessToken = await getSalesforceAccessToken();
  const baseUrl = getSalesforceDomainUrl();
  const url = `${baseUrl}/services/data/${API_VERSION}/sobjects/${objectType}/${recordId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete ${objectType}/${recordId}: ${response.status} ${errorText}`);
  }

  return { success: true };
}
