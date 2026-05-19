export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
};

export type JobStatus = 'open' | 'closed' | 'draft' | 'on_hold';
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
  postedAt: string;
  closingDate?: string;
  hiringManagerId: string;
  createdAt: string;
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
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  resumeUrl?: string;
  skills: string[];
  status: CandidateStatus;
  source: string;
  createdAt: string;
  notes?: string;
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
  coverLetter?: string;
};

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'hr';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type Interview = {
  id: string;
  jobId: string;
  candidateId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number;
  interviewers: string[];
  notes?: string;
  feedback?: string;
  rating?: number;
  createdAt: string;
};

export type RequisitionStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'closed';

export type Requisition = {
  id: string;
  jobTitle: string;
  department: string;
  headcount: number;
  status: RequisitionStatus;
  priority: 'low' | 'medium' | 'high';
  requestedBy: string;
  approvedBy?: string;
  justification?: string;
  createdAt: string;
  updatedAt: string;
};

export type Referral = {
  id: string;
  referrerId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  status: 'pending' | 'reviewing' | 'hired' | 'rejected';
  notes?: string;
  createdAt: string;
};

export type ReportMetric = {
  label: string;
  value: number;
  change?: number;
};

export type StoreState = {
  currentUser: User;
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  requisitions: Requisition[];
  referrals: Referral[];
};
