import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  assignee: z.string().max(18).optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
});

export const updateTaskSchema = z.object({
  status: z.enum(['Not Started', 'In Progress', 'Completed']).optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  assignee: z.string().max(18).optional(),
  dueDate: z.string().optional(),
}).refine(obj => Object.keys(obj).length > 0, {
  message: 'At least one field is required',
});

export const createNoteSchema = z.object({
  title: z.string().max(255).optional(),
  body: z.string().min(1).max(32000),
  type: z.string().max(50).optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().max(255).optional(),
  body: z.string().min(1).max(32000).optional(),
  type: z.string().max(50).optional(),
}).refine(obj => Object.keys(obj).length > 0, {
  message: 'At least one field is required',
});

export const addAttendeeSchema = z.object({
  contactId: z.string().min(15).max(18),
  role: z.string().max(50).optional(),
  rsvpStatus: z.enum(['Draft', 'Invited', 'Accepted', 'Declined', 'Cancelled', 'Waitlist']).optional(),
});

export const updateAttendeeSchema = z.object({
  rsvpStatus: z.enum(['Draft', 'Invited', 'Accepted', 'Declined', 'Cancelled', 'Waitlist']).optional(),
  attendanceStatus: z.enum(['Not Checked In', 'Checked In', 'Checked Out', 'No Show', 'Left Early']).optional(),
}).refine(obj => Object.keys(obj).length > 0, {
  message: 'At least one field is required',
});
