import { useState, useCallback } from 'react';
import { loadData, saveData } from '@/lib/storage';
import { seedData } from '@/lib/seedData';
import type {
  Job,
  Candidate,
  Application,
  Interview,
  Requisition,
  Referral,
  User,
  UserRole,
} from '@/types';

export type StoreType = {
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  requisitions: Requisition[];
  referrals: Referral[];
  currentUser: User;
  switchRole: (role: UserRole) => void;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (candidate: Candidate) => void;
  deleteCandidate: (id: string) => void;
  addApplication: (application: Application) => void;
  updateApplication: (application: Application) => void;
  deleteApplication: (id: string) => void;
  addInterview: (interview: Interview) => void;
  updateInterview: (interview: Interview) => void;
  deleteInterview: (id: string) => void;
  addRequisition: (requisition: Requisition) => void;
  updateRequisition: (requisition: Requisition) => void;
  deleteRequisition: (id: string) => void;
  addReferral: (referral: Referral) => void;
  updateReferral: (referral: Referral) => void;
  deleteReferral: (id: string) => void;
};

const DEFAULT_USER: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@company.com',
  role: 'admin',
  department: 'HR',
};

function initState<T>(key: string, fallback: T[]): T[] {
  const stored = loadData<T[]>(key);
  if (stored && stored.length > 0) return stored;
  return fallback;
}

export function useStore(): StoreType {
  const seed = seedData();

  const [jobs, setJobs] = useState<Job[]>(() => initState('jobs', seed.jobs));
  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    initState('candidates', seed.candidates)
  );
  const [applications, setApplications] = useState<Application[]>(() =>
    initState('applications', seed.applications)
  );
  const [interviews, setInterviews] = useState<Interview[]>(() =>
    initState('interviews', seed.interviews)
  );
  const [requisitions, setRequisitions] = useState<Requisition[]>(() =>
    initState('requisitions', seed.requisitions)
  );
  const [referrals, setReferrals] = useState<Referral[]>(() =>
    initState('referrals', seed.referrals)
  );
  const [currentUser, setCurrentUser] = useState<User>(
    () => loadData<User>('currentUser') || DEFAULT_USER
  );

  const switchRole = useCallback((role: UserRole) => {
    setCurrentUser((u) => {
      const updated = { ...u, role };
      saveData('currentUser', updated);
      return updated;
    });
  }, []);

  const addJob = useCallback((job: Job) => {
    setJobs((prev) => { const next = [...prev, job]; saveData('jobs', next); return next; });
  }, []);
  const updateJob = useCallback((job: Job) => {
    setJobs((prev) => { const next = prev.map((j) => (j.id === job.id ? job : j)); saveData('jobs', next); return next; });
  }, []);
  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => { const next = prev.filter((j) => j.id !== id); saveData('jobs', next); return next; });
  }, []);

  const addCandidate = useCallback((candidate: Candidate) => {
    setCandidates((prev) => { const next = [...prev, candidate]; saveData('candidates', next); return next; });
  }, []);
  const updateCandidate = useCallback((candidate: Candidate) => {
    setCandidates((prev) => { const next = prev.map((c) => (c.id === candidate.id ? candidate : c)); saveData('candidates', next); return next; });
  }, []);
  const deleteCandidate = useCallback((id: string) => {
    setCandidates((prev) => { const next = prev.filter((c) => c.id !== id); saveData('candidates', next); return next; });
  }, []);

  const addApplication = useCallback((application: Application) => {
    setApplications((prev) => { const next = [...prev, application]; saveData('applications', next); return next; });
  }, []);
  const updateApplication = useCallback((application: Application) => {
    setApplications((prev) => { const next = prev.map((a) => (a.id === application.id ? application : a)); saveData('applications', next); return next; });
  }, []);
  const deleteApplication = useCallback((id: string) => {
    setApplications((prev) => { const next = prev.filter((a) => a.id !== id); saveData('applications', next); return next; });
  }, []);

  const addInterview = useCallback((interview: Interview) => {
    setInterviews((prev) => { const next = [...prev, interview]; saveData('interviews', next); return next; });
  }, []);
  const updateInterview = useCallback((interview: Interview) => {
    setInterviews((prev) => { const next = prev.map((i) => (i.id === interview.id ? interview : i)); saveData('interviews', next); return next; });
  }, []);
  const deleteInterview = useCallback((id: string) => {
    setInterviews((prev) => { const next = prev.filter((i) => i.id !== id); saveData('interviews', next); return next; });
  }, []);

  const addRequisition = useCallback((requisition: Requisition) => {
    setRequisitions((prev) => { const next = [...prev, requisition]; saveData('requisitions', next); return next; });
  }, []);
  const updateRequisition = useCallback((requisition: Requisition) => {
    setRequisitions((prev) => { const next = prev.map((r) => (r.id === requisition.id ? requisition : r)); saveData('requisitions', next); return next; });
  }, []);
  const deleteRequisition = useCallback((id: string) => {
    setRequisitions((prev) => { const next = prev.filter((r) => r.id !== id); saveData('requisitions', next); return next; });
  }, []);

  const addReferral = useCallback((referral: Referral) => {
    setReferrals((prev) => { const next = [...prev, referral]; saveData('referrals', next); return next; });
  }, []);
  const updateReferral = useCallback((referral: Referral) => {
    setReferrals((prev) => { const next = prev.map((r) => (r.id === referral.id ? referral : r)); saveData('referrals', next); return next; });
  }, []);
  const deleteReferral = useCallback((id: string) => {
    setReferrals((prev) => { const next = prev.filter((r) => r.id !== id); saveData('referrals', next); return next; });
  }, []);

  return {
    jobs,
    candidates,
    applications,
    interviews,
    requisitions,
    referrals,
    currentUser,
    switchRole,
    addJob,
    updateJob,
    deleteJob,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    addApplication,
    updateApplication,
    deleteApplication,
    addInterview,
    updateInterview,
    deleteInterview,
    addRequisition,
    updateRequisition,
    deleteRequisition,
    addReferral,
    updateReferral,
    deleteReferral,
  };
}
