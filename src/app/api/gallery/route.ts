import type { GalleryImage } from '@/types/content';
import { getSortedRecords } from '@/lib/salesforce-request';
import { createSalesforceRoute } from '@/lib/salesforce-route';

const transformGalleryImage = (object: Record<string, any>): GalleryImage => ({
  id: object["Id"],
  image: object["Image_URL__c"],
  variant: object["Variant__c"]?.toLowerCase(),
  sortOrder: object["Sort_Order__c"],
  status: object["Status__c"],
});

export const GET = createSalesforceRoute<GalleryImage>({
  label: 'gallery',
  fetcher: () => getSortedRecords("Gallery_Image__c", 40, false, "ORDER+BY+Sort_Order__c+ASC"),
  transform: transformGalleryImage,
  postProcess: (images) => images.filter((image) => image.status === 'Active'),
});
