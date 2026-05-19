export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';

export type JobStatus = 'draft' | 'open' | 'closed' | 'on_hold';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';

export type CandidateStatus =
  | 'new'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';

export type RequisitionStatus = 'pending' | 'approved' | 'rejected' | 'open';
export type RequisitionPriority = 'low' | 'medium' | 'high';

export type ReferralStatus = 'pending' | 'reviewing' | 'hired' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string[];
  salary?: { min: number; max: number; currency: string };
  postedAt: string;
  closingAt?: string;
  hiringManagerId: string;
  applicationCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  currentCompany?: string;
  linkedIn?: string;
  resumeUrl?: string;
  status: CandidateStatus;
  jobId: string;
  appliedAt: string;
  notes?: string;
  tags?: string[];
  rating?: number;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: CandidateStatus;
  appliedAt: string;
  notes?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  interviewerId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number;
  notes?: string;
  feedback?: string;
  rating?: number;
}

export interface Requisition {
  id: string;
  title: string;
  department: string;
  headcount: number;
  priority: RequisitionPriority;
  status: RequisitionStatus;
  requestedById: string;
  createdAt: string;
  notes?: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  status: ReferralStatus;
  createdAt: string;
  notes?: string;
}

export interface AppSettings {
  companyName: string;
  companyWebsite?: string;
  defaultCurrency: string;
  emailNotifications: boolean;
  slackIntegration: boolean;
}
