import { useState, useCallback } from 'react';
import type { StoreType, Job, Candidate, Application, Interview, Requisition, Referral, UserRole, CandidateStatus } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { seedData } from '@/lib/seedData';

const STORAGE_KEY = 'ats_store';

function getInitialState() {
  const stored = loadFromStorage(STORAGE_KEY);
  if (stored) return stored;
  return seedData;
}

export function useStore(): StoreType {
  const [state, setState] = useState(getInitialState);

  const persist = useCallback((updater: (prev: typeof state) => typeof state) => {
    setState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Jobs
  const addJob = useCallback((job: Omit<Job, 'id' | 'createdAt'>) => {
    persist((prev) => ({
      ...prev,
      jobs: [...prev.jobs, { ...job, id: generateId(), createdAt: new Date().toISOString() }],
    }));
  }, [persist]);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    persist((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    }));
  }, [persist]);

  const deleteJob = useCallback((id: string) => {
    persist((prev) => ({
      ...prev,
      jobs: prev.jobs.filter((j) => j.id !== id),
    }));
  }, [persist]);

  // Candidates
  const addCandidate = useCallback((candidate: Omit<Candidate, 'id' | 'appliedAt' | 'createdAt'>) => {
    const now = new Date().toISOString();
    persist((prev) => ({
      ...prev,
      candidates: [...prev.candidates, { ...candidate, id: generateId(), appliedAt: now, createdAt: now }],
    }));
  }, [persist]);

  const updateCandidate = useCallback((id: string, updates: Partial<Candidate>) => {
    persist((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, [persist]);

  const updateCandidateStatus = useCallback((id: string, status: CandidateStatus) => {
    persist((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
  }, [persist]);

  const deleteCandidate = useCallback((id: string) => {
    persist((prev) => ({
      ...prev,
      candidates: prev.candidates.filter((c) => c.id !== id),
    }));
  }, [persist]);

  // Applications
  const addApplication = useCallback((application: Omit<Application, 'id' | 'appliedAt'>) => {
    persist((prev) => ({
      ...prev,
      applications: [...prev.applications, { ...application, id: generateId(), appliedAt: new Date().toISOString() }],
    }));
  }, [persist]);

  const updateApplication = useCallback((id: string, updates: Partial<Application>) => {
    persist((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  }, [persist]);

  const deleteApplication = useCallback((id: string) => {
    persist((prev) => ({
      ...prev,
      applications: prev.applications.filter((a) => a.id !== id),
    }));
  }, [persist]);

  // Interviews
  const addInterview = useCallback((interview: Omit<Interview, 'id'>) => {
    persist((prev) => ({
      ...prev,
      interviews: [...prev.interviews, { ...interview, id: generateId() }],
    }));
  }, [persist]);

  const updateInterview = useCallback((id: string, updates: Partial<Interview>) => {
    persist((prev) => ({
      ...prev,
      interviews: prev.interviews.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  }, [persist]);

  const deleteInterview = useCallback((id: string) => {
    persist((prev) => ({
      ...prev,
      interviews: prev.interviews.filter((i) => i.id !== id),
    }));
  }, [persist]);

  // Requisitions
  const addRequisition = useCallback((req: Omit<Requisition, 'id' | 'createdAt'>) => {
    persist((prev) => ({
      ...prev,
      requisitions: [...prev.requisitions, { ...req, id: generateId(), createdAt: new Date().toISOString() }],
    }));
  }, [persist]);

  const updateRequisition = useCallback((id: string, updates: Partial<Requisition>) => {
    persist((prev) => ({
      ...prev,
      requisitions: prev.requisitions.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  }, [persist]);

  // Referrals
  const addReferral = useCallback((ref: Omit<Referral, 'id' | 'createdAt'>) => {
    persist((prev) => ({
      ...prev,
      referrals: [...prev.referrals, { ...ref, id: generateId(), createdAt: new Date().toISOString() }],
    }));
  }, [persist]);

  const updateReferral = useCallback((id: string, updates: Partial<Referral>) => {
    persist((prev) => ({
      ...prev,
      referrals: prev.referrals.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  }, [persist]);

  // User / Role
  const switchRole = useCallback((role: UserRole) => {
    persist((prev) => ({
      ...prev,
      currentUser: { ...prev.currentUser, role },
    }));
  }, [persist]);

  return {
    ...state,
    addJob,
    updateJob,
    deleteJob,
    addCandidate,
    updateCandidate,
    updateCandidateStatus,
    deleteCandidate,
    addApplication,
    updateApplication,
    deleteApplication,
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
