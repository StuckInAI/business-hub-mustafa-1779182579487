import { useState, useCallback } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
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

const STORAGE_KEYS = {
  jobs: 'ats_jobs',
  candidates: 'ats_candidates',
  applications: 'ats_applications',
  interviews: 'ats_interviews',
  requisitions: 'ats_requisitions',
  referrals: 'ats_referrals',
  currentUser: 'ats_current_user',
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function now(): string {
  return new Date().toISOString();
}

export function useStore() {
  const [jobs, setJobs] = useState<Job[]>(() =>
    loadFromStorage(STORAGE_KEYS.jobs, seedData.jobs)
  );
  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    loadFromStorage(STORAGE_KEYS.candidates, seedData.candidates)
  );
  const [applications, setApplications] = useState<Application[]>(() =>
    loadFromStorage(STORAGE_KEYS.applications, seedData.applications)
  );
  const [interviews, setInterviews] = useState<Interview[]>(() =>
    loadFromStorage(STORAGE_KEYS.interviews, seedData.interviews)
  );
  const [requisitions, setRequisitions] = useState<Requisition[]>(() =>
    loadFromStorage(STORAGE_KEYS.requisitions, seedData.requisitions)
  );
  const [referrals, setReferrals] = useState<Referral[]>(() =>
    loadFromStorage(STORAGE_KEYS.referrals, seedData.referrals)
  );
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadFromStorage(STORAGE_KEYS.currentUser, seedData.users[0])
  );

  // ---- Jobs ----
  const addJob = useCallback((job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJob: Job = { ...job, id: generateId(), createdAt: now(), updatedAt: now() };
    setJobs((prev) => {
      const updated = [newJob, ...prev];
      saveToStorage(STORAGE_KEYS.jobs, updated);
      return updated;
    });
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs((prev) => {
      const updated = prev.map((j) => (j.id === id ? { ...j, ...updates, updatedAt: now() } : j));
      saveToStorage(STORAGE_KEYS.jobs, updated);
      return updated;
    });
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => {
      const updated = prev.filter((j) => j.id !== id);
      saveToStorage(STORAGE_KEYS.jobs, updated);
      return updated;
    });
  }, []);

  // ---- Candidates ----
  const addCandidate = useCallback((candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCandidate: Candidate = { ...candidate, id: generateId(), createdAt: now(), updatedAt: now() };
    setCandidates((prev) => {
      const updated = [newCandidate, ...prev];
      saveToStorage(STORAGE_KEYS.candidates, updated);
      return updated;
    });
  }, []);

  const updateCandidate = useCallback((id: string, updates: Partial<Candidate>) => {
    setCandidates((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: now() } : c));
      saveToStorage(STORAGE_KEYS.candidates, updated);
      return updated;
    });
  }, []);

  const updateCandidateStatus = useCallback((id: string, status: Candidate['status']) => {
    setCandidates((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, status, updatedAt: now() } : c));
      saveToStorage(STORAGE_KEYS.candidates, updated);
      return updated;
    });
  }, []);

  // ---- Applications ----
  const addApplication = useCallback((application: Omit<Application, 'id' | 'appliedAt' | 'updatedAt'>) => {
    const newApp: Application = { ...application, id: generateId(), appliedAt: now(), updatedAt: now() };
    setApplications((prev) => {
      const updated = [newApp, ...prev];
      saveToStorage(STORAGE_KEYS.applications, updated);
      return updated;
    });
  }, []);

  const updateApplicationStage = useCallback((id: string, stage: Application['stage']) => {
    setApplications((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, stage, updatedAt: now() } : a));
      saveToStorage(STORAGE_KEYS.applications, updated);
      return updated;
    });
  }, []);

  // ---- Interviews ----
  const addInterview = useCallback((interview: Omit<Interview, 'id' | 'createdAt'>) => {
    const newInterview: Interview = { ...interview, id: generateId(), createdAt: now() };
    setInterviews((prev) => {
      const updated = [newInterview, ...prev];
      saveToStorage(STORAGE_KEYS.interviews, updated);
      return updated;
    });
  }, []);

  const updateInterview = useCallback((id: string, updates: Partial<Interview>) => {
    setInterviews((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, ...updates } : i));
      saveToStorage(STORAGE_KEYS.interviews, updated);
      return updated;
    });
  }, []);

  // ---- Requisitions ----
  const addRequisition = useCallback((req: Omit<Requisition, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReq: Requisition = { ...req, id: generateId(), createdAt: now(), updatedAt: now() };
    setRequisitions((prev) => {
      const updated = [newReq, ...prev];
      saveToStorage(STORAGE_KEYS.requisitions, updated);
      return updated;
    });
  }, []);

  const updateRequisition = useCallback((id: string, updates: Partial<Requisition>) => {
    setRequisitions((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: now() } : r));
      saveToStorage(STORAGE_KEYS.requisitions, updated);
      return updated;
    });
  }, []);

  // ---- Referrals ----
  const addReferral = useCallback((referral: Omit<Referral, 'id' | 'createdAt'>) => {
    const newReferral: Referral = { ...referral, id: generateId(), createdAt: now() };
    setReferrals((prev) => {
      const updated = [newReferral, ...prev];
      saveToStorage(STORAGE_KEYS.referrals, updated);
      return updated;
    });
  }, []);

  // ---- User / Role ----
  const switchRole = useCallback((role: UserRole) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, role };
      saveToStorage(STORAGE_KEYS.currentUser, updated);
      return updated;
    });
  }, []);

  return {
    // state
    jobs,
    candidates,
    applications,
    interviews,
    requisitions,
    referrals,
    currentUser,
    // job actions
    addJob,
    updateJob,
    deleteJob,
    // candidate actions
    addCandidate,
    updateCandidate,
    updateCandidateStatus,
    // application actions
    addApplication,
    updateApplicationStage,
    // interview actions
    addInterview,
    updateInterview,
    // requisition actions
    addRequisition,
    updateRequisition,
    // referral actions
    addReferral,
    // user actions
    switchRole,
  };
}

export type StoreType = ReturnType<typeof useStore>;
