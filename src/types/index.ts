export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
};

export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

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
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: Salary;
  closingDate?: string;
  hiringManagerId: string;
  recruiterId?: string;
  createdAt: string;
  updatedAt: string;
  applicationCount?: number;
};

export type ApplicationStatus =
  | 'new'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  currentCompany?: string;
  experience?: number;
  skills: string[];
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  stage: string;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
  rating?: number;
  recruiterId?: string;
};

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type Interview = {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number;
  interviewerIds: string[];
  feedback?: string;
  rating?: number;
  notes?: string;
  meetingLink?: string;
  createdAt: string;
};

export type RequisitionStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'fulfilled';
export type RequisitionPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Requisition = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  status: RequisitionStatus;
  priority: RequisitionPriority;
  requestedBy: string;
  approvedBy?: string;
  justification: string;
  headcount: number;
  budgetMin?: number;
  budgetMax?: number;
  targetStartDate?: string;
  createdAt: string;
  updatedAt: string;
  jobId?: string;
};

export type ReferralStatus = 'pending' | 'reviewed' | 'hired' | 'rejected';

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

export type PipelineStage = {
  id: string;
  name: string;
  order: number;
  color: string;
};

export type AppSettings = {
  companyName: string;
  companyWebsite?: string;
  defaultCurrency: string;
  stages: PipelineStage[];
};
