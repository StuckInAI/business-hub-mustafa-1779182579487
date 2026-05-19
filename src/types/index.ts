export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';

export type JobStatus = 'draft' | 'active' | 'paused' | 'closed';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type JobDepartment = 'engineering' | 'design' | 'product' | 'marketing' | 'sales' | 'hr' | 'finance' | 'operations' | 'other';

export type CandidateStatus =
  | 'new'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type RequisitionStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'filled' | 'cancelled';
export type RequisitionPriority = 'low' | 'medium' | 'high' | 'urgent';

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
  department: JobDepartment;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string[];
  salary?: { min: number; max: number; currency: string };
  createdAt: string;
  updatedAt: string;
  hiringManagerId: string;
  recruiterId?: string;
  applicantCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobId: string;
  jobTitle: string;
  candidateStatus: CandidateStatus;
  stage: CandidateStatus;
  resumeUrl?: string;
  coverLetter?: string;
  appliedAt: string;
  updatedAt: string;
  tags: string[];
  rating?: number;
  notes: Note[];
  source: string;
}

export interface Note {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  interviewerId: string;
  interviewerName: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number;
  location?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
}

export interface Requisition {
  id: string;
  title: string;
  department: JobDepartment;
  requestedById: string;
  requestedByName: string;
  status: RequisitionStatus;
  priority: RequisitionPriority;
  headcount: number;
  justification: string;
  createdAt: string;
  updatedAt: string;
  approvedById?: string;
  approvedByName?: string;
  linkedJobId?: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  status: ReferralStatus;
  createdAt: string;
  notes?: string;
}

export interface StoreType {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  requisitions: Requisition[];
  referrals: Referral[];
  currentUser: User;
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'appliedAt' | 'updatedAt' | 'notes'>) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  addRequisition: (req: Omit<Requisition, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRequisition: (id: string, updates: Partial<Requisition>) => void;
  addReferral: (ref: Omit<Referral, 'id' | 'createdAt'>) => void;
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  switchRole: (role: UserRole) => void;
  addNote: (candidateId: string, content: string) => void;
}
