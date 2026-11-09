import type { Testimonial } from '@/types/content';
import { getSortedRecords } from '@/lib/salesforce-request';
import { createSalesforceRoute } from '@/lib/salesforce-route';

const transformTestimonial = (object: Record<string, any>): Testimonial => ({
  id: object["Name"],
  quote: object["Quote__c"],
  attribution: object["Attribution__c"],
  status: object["Status__c"],
});

export const GET = createSalesforceRoute<Testimonial>({
  label: 'testimonials',
  fetcher: () => getSortedRecords("Testimonial__c", 20, false, "ORDER+BY+Sort_Order__c+ASC"),
  transform: transformTestimonial,
  postProcess: (testimonials) => testimonials.filter((testimonial) => testimonial.status === 'Active'),
});
