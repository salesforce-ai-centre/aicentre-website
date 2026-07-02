export interface EventDetail {
  id: string;
  name: string;
  status: string;
  date: string | null;
  startDateTime: string | null;
  endDateTime: string | null;
  eventType: string | null;
  tier: string | null;
  description: string | null;
  program: string | null;
  host: string | null;
  industry: string | null;
  audienceType: string | null;
  totalAttendees: number;
  checkedInCount: number;
  slackChannelLink: string | null;
  googleSlidesUrl: string | null;
  agendaId: string | null;
  logoUrl: string | null;
}

export interface EventTeamMember {
  id: string;
  contactId: string;
  name: string;
  email: string | null;
  role: string;
  rsvpStatus: string | null;
  attendanceStatus: string | null;
  avatarUrl: string | null;
}

export interface EventAttendee {
  id: string;
  contactId: string;
  name: string;
  company: string | null;
  role: string | null;
  rsvpStatus: string | null;
  attendanceStatus: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
}

export interface EventTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  assignee: string | null;
  dueDate: string | null;
  priority: string | null;
}

export interface AgendaItem {
  id: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  duration: string | null;
  speaker: string | null;
  description: string | null;
  sortOrder: number;
}

export interface EventAgenda {
  id: string;
  name: string;
  items: AgendaItem[];
}

export interface EventAccount {
  id: string;
  accountId: string;
  accountName: string;
  isPrimary: boolean;
  industry: string | null;
}

export interface EventOpportunity {
  id: string;
  opportunityId: string;
  opportunityName: string;
  amount: number | null;
  stage: string | null;
  closeDate: string | null;
}

export interface EventNote {
  id: string;
  title: string | null;
  body: string;
  type: string | null;
  createdDate: string;
  lastModifiedDate: string;
  createdBy: string | null;
}

export interface EventFeedback {
  id: string;
  type: string | null;
  responseCount: number;
  averageRating: number | null;
  responses: FeedbackResponse[];
}

export interface FeedbackResponse {
  id: string;
  question: string | null;
  answer: string | null;
  rating: number | null;
}

export interface EngageData {
  quizResults: QuizResult[];
  huntResults: HuntResult[];
  wordCloudEntries: WordCloudEntry[];
}

export interface QuizResult {
  id: string;
  quizName: string;
  participantCount: number;
  averageScore: number | null;
}

export interface HuntResult {
  id: string;
  huntName: string;
  completionCount: number;
}

export interface WordCloudEntry {
  word: string;
  count: number;
}

export interface F1RaceData {
  raceId: string;
  raceName: string;
  entries: F1RaceEntry[];
}

export interface F1RaceEntry {
  id: string;
  driverName: string;
  driverPersona: string | null;
  bestLapTime: number | null;
  topSpeed: number | null;
  finalPosition: number | null;
}

// Write payloads
export interface CreateTaskPayload {
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: string;
}

export interface UpdateTaskPayload {
  status?: string;
  title?: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
}

export interface CreateNotePayload {
  title?: string;
  body: string;
  type?: string;
}

export interface UpdateNotePayload {
  title?: string;
  body?: string;
  type?: string;
}

export interface AddAttendeePayload {
  contactId: string;
  role?: string;
  rsvpStatus?: string;
}

export interface UpdateAttendeePayload {
  rsvpStatus?: string;
  attendanceStatus?: string;
}
