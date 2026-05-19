export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
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
  description?: string;
  requirements?: string[];
  salary?: { min: number; max: number; currency: string };
  createdAt: string;
  postedAt?: string;
  hiringManagerId?: string;
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
  jobId?: string;
  status: CandidateStatus;
  resumeUrl?: string;
  notes?: string;
  appliedAt: string;
  createdAt: string;
  source?: string;
  tags?: string[];
};

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'hr';

export type Interview = {
  id: string;
  candidateId: string;
  jobId: string;
  interviewerId?: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration?: number;
  notes?: string;
  feedback?: string;
  score?: number;
  createdAt: string;
};

export type RequisitionStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'open' | 'closed';
export type RequisitionPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Requisition = {
  id: string;
  title: string;
  department: string;
  location?: string;
  headcount: number;
  priority: RequisitionPriority;
  status: RequisitionStatus;
  requestedById?: string;
  jobId?: string;
  notes?: string;
  createdAt: string;
};

export type ReferralStatus = 'pending' | 'reviewing' | 'hired' | 'rejected';

export type Referral = {
  id: string;
  referrerId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  status: ReferralStatus;
  notes?: string;
  createdAt: string;
};

export type StoreType = {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  requisitions: Requisition[];
  referrals: Referral[];
  users: User[];
  currentUser: User;
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt'>) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  addInterview: (interview: Omit<Interview, 'id' | 'createdAt'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  addRequisition: (req: Omit<Requisition, 'id' | 'createdAt'>) => void;
  updateRequisition: (id: string, updates: Partial<Requisition>) => void;
  deleteRequisition: (id: string) => void;
  addReferral: (referral: Omit<Referral, 'id' | 'createdAt'>) => void;
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  deleteReferral: (id: string) => void;
  switchRole: (role: UserRole) => void;
};
