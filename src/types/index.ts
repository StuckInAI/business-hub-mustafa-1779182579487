export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';

export type JobStatus = 'draft' | 'open' | 'closed' | 'paused';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type WorkMode = 'onsite' | 'remote' | 'hybrid';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  status: JobStatus;
  type: JobType;
  workMode: WorkMode;
  description: string;
  requirements: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  headcount: number;
  filled: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CandidateStatus =
  | 'new'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  currentCompany?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  skills: string[];
  status: CandidateStatus;
  jobId?: string;
  source?: string;
  notes?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'cultural';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  interviewers: string[];
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number;
  location?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export type RequisitionStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Requisition {
  id: string;
  jobTitle: string;
  department: string;
  requestedBy: string;
  status: RequisitionStatus;
  headcount: number;
  justification?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReferralStatus = 'pending' | 'reviewing' | 'hired' | 'rejected';

export interface Referral {
  id: string;
  referrerName: string;
  referrerEmail: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  status: ReferralStatus;
  notes?: string;
  bonus?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
}

export interface AppStore {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  requisitions: Requisition[];
  referrals: Referral[];
  currentUser: User;
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  addInterview: (interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  addRequisition: (req: Omit<Requisition, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRequisition: (id: string, updates: Partial<Requisition>) => void;
  addReferral: (ref: Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  switchRole: (role: UserRole) => void;
}
