import { useState, useCallback } from 'react';
import { seedData } from '@/lib/seedData';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import type {
  Job,
  Candidate,
  Interview,
  Requisition,
  Referral,
  User,
  UserRole,
  StoreType,
  CandidateStatus,
} from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'ats_store';

const defaultUser: User = {
  id: 'user-1',
  name: 'Sarah Johnson',
  email: 'sarah@company.com',
  role: 'admin',
};

function getInitialState() {
  const stored = loadFromStorage<{
    jobs: Job[];
    candidates: Candidate[];
    interviews: Interview[];
    requisitions: Requisition[];
    referrals: Referral[];
    currentUser: User;
  }>(STORAGE_KEY);

  if (stored) return stored;

  return {
    ...seedData,
    currentUser: defaultUser,
  };
}

export function useStore(): StoreType {
  const initial = getInitialState();
  const [jobs, setJobs] = useState<Job[]>(initial.jobs);
  const [candidates, setCandidates] = useState<Candidate[]>(initial.candidates);
  const [interviews, setInterviews] = useState<Interview[]>(initial.interviews);
  const [requisitions, setRequisitions] = useState<Requisition[]>(initial.requisitions);
  const [referrals, setReferrals] = useState<Referral[]>(initial.referrals);
  const [currentUser, setCurrentUser] = useState<User>(initial.currentUser);

  const persist = useCallback(
    (updates: Partial<{ jobs: Job[]; candidates: Candidate[]; interviews: Interview[]; requisitions: Requisition[]; referrals: Referral[]; currentUser: User }>) => {
      saveToStorage(STORAGE_KEY, { jobs, candidates, interviews, requisitions, referrals, currentUser, ...updates });
    },
    [jobs, candidates, interviews, requisitions, referrals, currentUser]
  );

  const addJob = useCallback((job: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>) => {
    const newJob: Job = {
      ...job,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicantCount: 0,
    };
    setJobs((prev) => {
      const next = [newJob, ...prev];
      persist({ jobs: next });
      return next;
    });
  }, [persist]);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs((prev) => {
      const next = prev.map((j) => j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j);
      persist({ jobs: next });
      return next;
    });
  }, [persist]);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => {
      const next = prev.filter((j) => j.id !== id);
      persist({ jobs: next });
      return next;
    });
  }, [persist]);

  const addCandidate = useCallback((candidate: Omit<Candidate, 'id' | 'appliedAt' | 'updatedAt' | 'notes'>) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: generateId(),
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
    };
    setCandidates((prev) => {
      const next = [newCandidate, ...prev];
      persist({ candidates: next });
      return next;
    });
  }, [persist]);

  const updateCandidate = useCallback((id: string, updates: Partial<Candidate>) => {
    setCandidates((prev) => {
      const next = prev.map((c) => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c);
      persist({ candidates: next });
      return next;
    });
  }, [persist]);

  const deleteCandidate = useCallback((id: string) => {
    setCandidates((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persist({ candidates: next });
      return next;
    });
  }, [persist]);

  const addInterview = useCallback((interview: Omit<Interview, 'id'>) => {
    const newInterview: Interview = { ...interview, id: generateId() };
    setInterviews((prev) => {
      const next = [newInterview, ...prev];
      persist({ interviews: next });
      return next;
    });
  }, [persist]);

  const updateInterview = useCallback((id: string, updates: Partial<Interview>) => {
    setInterviews((prev) => {
      const next = prev.map((i) => i.id === id ? { ...i, ...updates } : i);
      persist({ interviews: next });
      return next;
    });
  }, [persist]);

  const deleteInterview = useCallback((id: string) => {
    setInterviews((prev) => {
      const next = prev.filter((i) => i.id !== id);
      persist({ interviews: next });
      return next;
    });
  }, [persist]);

  const addRequisition = useCallback((req: Omit<Requisition, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReq: Requisition = {
      ...req,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRequisitions((prev) => {
      const next = [newReq, ...prev];
      persist({ requisitions: next });
      return next;
    });
  }, [persist]);

  const updateRequisition = useCallback((id: string, updates: Partial<Requisition>) => {
    setRequisitions((prev) => {
      const next = prev.map((r) => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r);
      persist({ requisitions: next });
      return next;
    });
  }, [persist]);

  const addReferral = useCallback((ref: Omit<Referral, 'id' | 'createdAt'>) => {
    const newRef: Referral = {
      ...ref,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setReferrals((prev) => {
      const next = [newRef, ...prev];
      persist({ referrals: next });
      return next;
    });
  }, [persist]);

  const updateReferral = useCallback((id: string, updates: Partial<Referral>) => {
    setReferrals((prev) => {
      const next = prev.map((r) => r.id === id ? { ...r, ...updates } : r);
      persist({ referrals: next });
      return next;
    });
  }, [persist]);

  const switchRole = useCallback((role: UserRole) => {
    setCurrentUser((prev) => {
      const next = { ...prev, role };
      persist({ currentUser: next });
      return next;
    });
  }, [persist]);

  const addNote = useCallback((candidateId: string, content: string) => {
    setCandidates((prev) => {
      const next = prev.map((c) => {
        if (c.id !== candidateId) return c;
        const note = {
          id: generateId(),
          content,
          authorId: currentUser.id,
          authorName: currentUser.name,
          createdAt: new Date().toISOString(),
        };
        return { ...c, notes: [...c.notes, note], updatedAt: new Date().toISOString() };
      });
      persist({ candidates: next });
      return next;
    });
  }, [persist, currentUser]);

  // suppress unused type import warning
  void (null as unknown as CandidateStatus);

  return {
    jobs,
    candidates,
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
    addInterview,
    updateInterview,
    deleteInterview,
    addRequisition,
    updateRequisition,
    addReferral,
    updateReferral,
    switchRole,
    addNote,
  };
}
