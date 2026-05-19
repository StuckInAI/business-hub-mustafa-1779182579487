export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
};

export type JobStatus = 'draft' | 'open' | 'on_hold' | 'closed';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string[];
  salary?: { min: number; max: number; currency: string };
  hiringManagerId: string;
  createdAt: string;
  updatedAt: string;
};

export type CandidateStatus =
  | 'new'
  | 'screening'
  | 'interviewing'
  | 'offered'
  | 'hired'
  | 'rejected';

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  currentTitle: string;
  skills: string[];
  source: 'direct' | 'referral' | 'linkedin' | 'job_board' | 'careers_page';
  status: CandidateStatus;
  resumeUrl: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationStage =
  | 'applied'
  | 'screening'
  | 'technical_interview'
  | 'final_interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  stage: ApplicationStage;
  appliedAt: string;
  updatedAt: string;
  notes: string;
  rating?: number | null;
};

export type InterviewType =
  | 'phone_screen'
  | 'technical'
  | 'behavioral'
  | 'panel'
  | 'final';

export type Interview = {
  id: string;
  applicationId: string;
  type: InterviewType;
  scheduledAt: string;
  duration: number;
  interviewers: string[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes: string;
  feedback: string;
  rating: number | null;
  createdAt: string;
};

export type Requisition = {
  id: string;
  title: string;
  department: string;
  headcount: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'on_hold';
  justification: string;
  requestedBy: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Referral = {
  id: string;
  referrerId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string | null;
  status: 'pending' | 'reviewing' | 'hired' | 'rejected';
  notes: string;
  bonus: number | null;
  createdAt: string;
};
