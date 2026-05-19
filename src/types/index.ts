export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
};

export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';
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
  salaryMin?: number;
  salaryMax?: number;
  createdAt: string;
  updatedAt: string;
  hiringManagerId: string;
  applicationCount?: number;
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
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  currentCompany?: string;
  linkedIn?: string;
  portfolio?: string;
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

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'panel';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type Interview = {
  id: string;
  applicationId: string;
  candidateId: string;
  jobId: string;
  interviewerIds: string[];
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

export type Requisition = {
  id: string;
  title: string;
  department: string;
  headcount: number;
  status: RequisitionStatus;
  requestedBy: string;
  approvedBy?: string;
  jobId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Referral = {
  id: string;
  referrerId: string;
  referrerName: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  status: 'pending' | 'reviewed' | 'hired' | 'rejected';
  bonus?: number;
  notes?: string;
  createdAt: string;
};

export type StoreType = {
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  requisitions: Requisition[];
  referrals: Referral[];
  currentUser: User;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (candidate: Candidate) => void;
  deleteCandidate: (id: string) => void;
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
  addApplication: (application: Application) => void;
  updateApplication: (application: Application) => void;
  addInterview: (interview: Interview) => void;
  updateInterview: (interview: Interview) => void;
  deleteInterview: (id: string) => void;
  addRequisition: (requisition: Requisition) => void;
  updateRequisition: (requisition: Requisition) => void;
  addReferral: (referral: Referral) => void;
  updateReferral: (referral: Referral) => void;
  switchRole: (role: UserRole) => void;
};
