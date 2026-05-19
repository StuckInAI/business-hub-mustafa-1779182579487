import { useState } from 'react';
import type { Job, Candidate, Interview, Requisition, Referral, User, UserRole, StoreType } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { seedData } from '@/lib/seedData';
import { generateId } from '@/lib/utils';

function initData<T>(key: string, fallback: T[]): T[] {
  const stored = loadFromStorage<T[]>(key);
  if (stored && stored.length > 0) return stored;
  saveToStorage(key, fallback);
  return fallback;
}

export function useStore(): StoreType {
  const [jobs, setJobs] = useState<Job[]>(() => initData('jobs', seedData.jobs));
  const [candidates, setCandidates] = useState<Candidate[]>(() => initData('candidates', seedData.candidates));
  const [interviews, setInterviews] = useState<Interview[]>(() => initData('interviews', seedData.interviews));
  const [requisitions, setRequisitions] = useState<Requisition[]>(() => initData('requisitions', seedData.requisitions));
  const [referrals, setReferrals] = useState<Referral[]>(() => initData('referrals', seedData.referrals));
  const [users] = useState<User[]>(() => initData('users', seedData.users));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const stored = loadFromStorage<User>('currentUser');
    return stored ?? seedData.users[0];
  });

  // Jobs
  const addJob = (job: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = { ...job, id: generateId(), createdAt: new Date().toISOString() };
    setJobs((prev) => {
      const next = [...prev, newJob];
      saveToStorage('jobs', next);
      return next;
    });
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs((prev) => {
      const next = prev.map((j) => (j.id === id ? { ...j, ...updates } : j));
      saveToStorage('jobs', next);
      return next;
    });
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => {
      const next = prev.filter((j) => j.id !== id);
      saveToStorage('jobs', next);
      return next;
    });
  };

  // Candidates
  const addCandidate = (candidate: Omit<Candidate, 'id' | 'createdAt'>) => {
    const newCandidate: Candidate = { ...candidate, id: generateId(), createdAt: new Date().toISOString() };
    setCandidates((prev) => {
      const next = [...prev, newCandidate];
      saveToStorage('candidates', next);
      return next;
    });
  };

  const updateCandidate = (id: string, updates: Partial<Candidate>) => {
    setCandidates((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      saveToStorage('candidates', next);
      return next;
    });
  };

  const deleteCandidate = (id: string) => {
    setCandidates((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveToStorage('candidates', next);
      return next;
    });
  };

  // Interviews
  const addInterview = (interview: Omit<Interview, 'id' | 'createdAt'>) => {
    const newInterview: Interview = { ...interview, id: generateId(), createdAt: new Date().toISOString() };
    setInterviews((prev) => {
      const next = [...prev, newInterview];
      saveToStorage('interviews', next);
      return next;
    });
  };

  const updateInterview = (id: string, updates: Partial<Interview>) => {
    setInterviews((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, ...updates } : i));
      saveToStorage('interviews', next);
      return next;
    });
  };

  const deleteInterview = (id: string) => {
    setInterviews((prev) => {
      const next = prev.filter((i) => i.id !== id);
      saveToStorage('interviews', next);
      return next;
    });
  };

  // Requisitions
  const addRequisition = (req: Omit<Requisition, 'id' | 'createdAt'>) => {
    const newReq: Requisition = { ...req, id: generateId(), createdAt: new Date().toISOString() };
    setRequisitions((prev) => {
      const next = [...prev, newReq];
      saveToStorage('requisitions', next);
      return next;
    });
  };

  const updateRequisition = (id: string, updates: Partial<Requisition>) => {
    setRequisitions((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
      saveToStorage('requisitions', next);
      return next;
    });
  };

  const deleteRequisition = (id: string) => {
    setRequisitions((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveToStorage('requisitions', next);
      return next;
    });
  };

  // Referrals
  const addReferral = (referral: Omit<Referral, 'id' | 'createdAt'>) => {
    const newReferral: Referral = { ...referral, id: generateId(), createdAt: new Date().toISOString() };
    setReferrals((prev) => {
      const next = [...prev, newReferral];
      saveToStorage('referrals', next);
      return next;
    });
  };

  const updateReferral = (id: string, updates: Partial<Referral>) => {
    setReferrals((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
      saveToStorage('referrals', next);
      return next;
    });
  };

  const deleteReferral = (id: string) => {
    setReferrals((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveToStorage('referrals', next);
      return next;
    });
  };

  const switchRole = (role: UserRole) => {
    const user = users.find((u) => u.role === role) ?? { ...currentUser, role };
    setCurrentUser(user);
    saveToStorage('currentUser', user);
  };

  return {
    jobs,
    candidates,
    interviews,
    requisitions,
    referrals,
    users,
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
    deleteRequisition,
    addReferral,
    updateReferral,
    deleteReferral,
    switchRole,
  };
}
