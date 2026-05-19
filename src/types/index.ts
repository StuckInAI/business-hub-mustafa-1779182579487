export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
};

export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';

export type Salary = {
  min: number;
  max: number;
  currency: string;
};

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string[];
  salary?: Salary;
  closingDate?: string;
  createdAt: string;
  updatedAt: string;
  hiringManagerId: string;
  requisitionId?: string;
};

export type CandidateStatus =
  | 'new'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  currentCompany?: string;
  linkedIn?: string;
  resumeUrl?: string;
  skills: string[];
  status: CandidateStatus;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
  stage?: string;
};

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'hr';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type Interview = {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  interviewerId?: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number;
  location?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  createdAt: string;
};

export type RequisitionStatus = 'pending' | 'approved' | 'rejected' | 'open' | 'closed';
export type RequisitionPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Requisition = {
  id: string;
  title: string;
  department: string;
  headcount: number;
  priority: RequisitionPriority;
  status: RequisitionStatus;
  justification: string;
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  jobId?: string;
};

export type ReferralStatus = 'pending' | 'reviewing' | 'hired' | 'rejected';

export type Referral = {
  id: string;
  referrerId: string;
  referrerName: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  status: ReferralStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
