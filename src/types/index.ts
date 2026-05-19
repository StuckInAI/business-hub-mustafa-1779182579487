export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
};

export type JobStatus = 'draft' | 'open' | 'paused' | 'closed' | 'archived';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type WorkMode = 'remote' | 'onsite' | 'hybrid';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  workMode: WorkMode;
  type: JobType;
  status: JobStatus;
  headcount: number;
  filled: number;
  description: string;
  requirements: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  hiringManagerId: string;
  recruiterId: string;
  createdAt: string;
  publishedAt?: string;
  closedAt?: string;
  tags: string[];
  pipeline: PipelineStage[];
};

export type PipelineStage = {
  id: string;
  name: string;
  order: number;
  color: string;
};

export type CandidateStatus = 'active' | 'rejected' | 'withdrawn' | 'hired';

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  website?: string;
  resumeUrl?: string;
  source: CandidateSource;
  referredBy?: string;
  tags: string[];
  createdAt: string;
  applications: Application[];
};

export type CandidateSource =
  | 'careers_page'
  | 'linkedin'
  | 'referral'
  | 'agency'
  | 'github'
  | 'job_board'
  | 'sourced'
  | 'other';

export type Application = {
  id: string;
  candidateId: string;
  jobId: string;
  stageId: string;
  status: CandidateStatus;
  appliedAt: string;
  updatedAt: string;
  rating?: number;
  notes: Note[];
  interviews: Interview[];
  scorecards: Scorecard[];
  emails: EmailThread[];
  disqualifyReason?: string;
};

export type Note = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  isPinned: boolean;
};

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'panel';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type Interview = {
  id: string;
  applicationId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  durationMinutes: number;
  interviewerIds: string[];
  location?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: string;
};

export type Scorecard = {
  id: string;
  applicationId: string;
  interviewerId: string;
  overallRating: number;
  attributes: ScorecardAttribute[];
  recommendation: 'strong_yes' | 'yes' | 'neutral' | 'no' | 'strong_no';
  submittedAt: string;
  notes: string;
};

export type ScorecardAttribute = {
  name: string;
  rating: number;
  comment?: string;
};

export type EmailThread = {
  id: string;
  subject: string;
  messages: EmailMessage[];
  lastActivityAt: string;
};

export type EmailMessage = {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  sentAt: string;
  direction: 'outbound' | 'inbound';
};

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'application' | 'interview' | 'offer' | 'rejection' | 'general';
  createdAt: string;
};

export type AutomationTrigger =
  | 'stage_change'
  | 'application_created'
  | 'interview_scheduled'
  | 'scorecard_submitted';

export type AutomationAction =
  | 'send_email'
  | 'move_stage'
  | 'add_tag'
  | 'assign_interviewer'
  | 'send_notification';

export type AutomationRule = {
  id: string;
  name: string;
  isActive: boolean;
  trigger: AutomationTrigger;
  triggerCondition?: string;
  action: AutomationAction;
  actionConfig: Record<string, string>;
  createdAt: string;
};

export type Requisition = {
  id: string;
  jobTitle: string;
  department: string;
  headcount: number;
  justification: string;
  requestedBy: string;
  approvers: RequisitionApprover[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  jobId?: string;
};

export type RequisitionApprover = {
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  reviewedAt?: string;
};

export type Referral = {
  id: string;
  referrerId: string;
  candidateId: string;
  jobId: string;
  status: 'pending' | 'hired' | 'rejected';
  bonus?: number;
  createdAt: string;
};

export type DashboardStats = {
  openJobs: number;
  totalCandidates: number;
  activeApplications: number;
  interviewsThisWeek: number;
  offersExtended: number;
  timeToFill: number;
  offerAcceptRate: number;
  sourcingBreakdown: { source: string; count: number }[];
};
