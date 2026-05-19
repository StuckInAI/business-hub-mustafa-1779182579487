import { useState } from 'react';
import { loadData, saveData } from '@/lib/storage';
import { seedData } from '@/lib/seedData';
import type {
  Job,
  Candidate,
  CandidateStatus,
  Application,
  Interview,
  Requisition,
  Referral,
  User,
  UserRole,
  StoreType,
} from '@/types';

function getInitialData<T>(key: string, fallback: T[]): T[] {
  const stored = loadData<T[]>(key, []);
  if (stored && stored.length > 0) return stored;
  return fallback;
}

export function useStore(): StoreType {
  const [jobs, setJobs] = useState<Job[]>(() => getInitialData('jobs', seedData.jobs));
  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    getInitialData('candidates', seedData.candidates)
  );
  const [applications, setApplications] = useState<Application[]>(() =>
    getInitialData('applications', seedData.applications)
  );
  const [interviews, setInterviews] = useState<Interview[]>(() =>
    getInitialData('interviews', seedData.interviews)
  );
  const [requisitions, setRequisitions] = useState<Requisition[]>(() =>
    getInitialData('requisitions', seedData.requisitions)
  );
  const [referrals, setReferrals] = useState<Referral[]>(() =>
    getInitialData('referrals', seedData.referrals)
  );
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadData<User>('currentUser', seedData.currentUser)
  );

  const persist = <T>(key: string, value: T) => saveData(key, value);

  const addJob = (job: Job) => {
    setJobs((prev) => { const next = [...prev, job]; persist('jobs', next); return next; });
  };
  const updateJob = (job: Job) => {
    setJobs((prev) => { const next = prev.map((j) => (j.id === job.id ? job : j)); persist('jobs', next); return next; });
  };
  const deleteJob = (id: string) => {
    setJobs((prev) => { const next = prev.filter((j) => j.id !== id); persist('jobs', next); return next; });
  };

  const addCandidate = (candidate: Candidate) => {
    setCandidates((prev) => { const next = [...prev, candidate]; persist('candidates', next); return next; });
  };
  const updateCandidate = (candidate: Candidate) => {
    setCandidates((prev) => { const next = prev.map((c) => (c.id === candidate.id ? candidate : c)); persist('candidates', next); return next; });
  };
  const deleteCandidate = (id: string) => {
    setCandidates((prev) => { const next = prev.filter((c) => c.id !== id); persist('candidates', next); return next; });
  };
  const updateCandidateStatus = (id: string, status: CandidateStatus) => {
    setCandidates((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c));
      persist('candidates', next);
      return next;
    });
  };

  const addApplication = (application: Application) => {
    setApplications((prev) => { const next = [...prev, application]; persist('applications', next); return next; });
  };
  const updateApplication = (application: Application) => {
    setApplications((prev) => { const next = prev.map((a) => (a.id === application.id ? application : a)); persist('applications', next); return next; });
  };

  const addInterview = (interview: Interview) => {
    setInterviews((prev) => { const next = [...prev, interview]; persist('interviews', next); return next; });
  };
  const updateInterview = (interview: Interview) => {
    setInterviews((prev) => { const next = prev.map((i) => (i.id === interview.id ? interview : i)); persist('interviews', next); return next; });
  };
  const deleteInterview = (id: string) => {
    setInterviews((prev) => { const next = prev.filter((i) => i.id !== id); persist('interviews', next); return next; });
  };

  const addRequisition = (requisition: Requisition) => {
    setRequisitions((prev) => { const next = [...prev, requisition]; persist('requisitions', next); return next; });
  };
  const updateRequisition = (requisition: Requisition) => {
    setRequisitions((prev) => { const next = prev.map((r) => (r.id === requisition.id ? requisition : r)); persist('requisitions', next); return next; });
  };

  const addReferral = (referral: Referral) => {
    setReferrals((prev) => { const next = [...prev, referral]; persist('referrals', next); return next; });
  };
  const updateReferral = (referral: Referral) => {
    setReferrals((prev) => { const next = prev.map((r) => (r.id === referral.id ? referral : r)); persist('referrals', next); return next; });
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => { const next = { ...prev, role }; persist('currentUser', next); return next; });
  };

  return {
    jobs,
    candidates,
    applications,
    interviews,
    requisitions,
    referrals,
    currentUser,
    addJob,
    updateJob,
    deleteJob,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    updateCandidateStatus,
    addApplication,
    updateApplication,
    addInterview,
    updateInterview,
    deleteInterview,
    addRequisition,
    updateRequisition,
    addReferral,
    updateReferral,
    switchRole,
  };
}
