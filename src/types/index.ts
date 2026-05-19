export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';

export type CandidateStatus =
  | 'new'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export type JobStatus = 'draft' | 'open' | 'closed' | 'on_hold';

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';

export type ApplicationStatus =
  | 'applied'
  | 'reviewing'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export interface Candidate {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: CandidateStatus;
  source?: string;
  skills?: string[];
  resumeUrl?: string;
  notes?: string;
  appliedAt: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'internship';
  status: JobStatus;
  description?: string;
  requirements?: string;
  salary?: string;
  closingAt?: string;
  createdAt: string;
  hiringManagerId?: string;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  applicationId?: string;
  interviewerId: string;
  scheduledAt: string;
  duration: number;
  type: 'phone' | 'video' | 'onsite';
  status: InterviewStatus;
  notes?: string;
  feedback?: string;
}

export interface Requisition {
  id: string;
  title: string;
  department: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'filled';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  notes?: string;
}

export interface Referral {
  id: string;
  referrerName: string;
  referrerEmail: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  status: 'pending' | 'reviewing' | 'hired' | 'rejected';
  createdAt: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface StoreState {
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  requisitions: Requisition[];
  referrals: Referral[];
  currentUser: User;
}

export interface StoreType extends StoreState {
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'appliedAt' | 'createdAt'>) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
  deleteCandidate: (id: string) => void;
  addApplication: (application: Omit<Application, 'id' | 'appliedAt'>) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  addRequisition: (req: Omit<Requisition, 'id' | 'createdAt'>) => void;
  updateRequisition: (id: string, updates: Partial<Requisition>) => void;
  addReferral: (ref: Omit<Referral, 'id' | 'createdAt'>) => void;
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  switchRole: (role: UserRole) => void;
}
