import { useState, useEffect, useCallback } from 'react';
import { loadState, saveState } from '@/lib/storage';
import { seedData } from '@/lib/seedData';
import type {
  Job,
  Candidate,
  Interview,
  Requisition,
  Referral,
  User,
  UserRole,
  AppSettings,
  CandidateStatus,
  InterviewType,
  InterviewStatus,
} from '@/types';

export interface StoreType {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  requisitions: Requisition[];
  referrals: Referral[];
  users: User[];
  currentUser: User;
  settings: AppSettings;
  switchRole: (role: UserRole) => void;
  addJob: (job: Omit<Job, 'id' | 'postedAt' | 'applicationCount'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'appliedAt'>) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  addRequisition: (req: Omit<Requisition, 'id' | 'createdAt'>) => void;
  updateRequisition: (id: string, updates: Partial<Requisition>) => void;
  deleteRequisition: (id: string) => void;
  addReferral: (ref: Omit<Referral, 'id' | 'createdAt'>) => void;
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  deleteReferral: (id: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

interface State {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  requisitions: Requisition[];
  referrals: Referral[];
  users: User[];
  currentUserId: string;
  settings: AppSettings;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const defaultSettings: AppSettings = {
  companyName: 'TalentFlow Inc.',
  defaultCurrency: 'USD',
  emailNotifications: true,
  slackIntegration: false,
};

export function useStore(): StoreType {
  const [state, setState] = useState<State>(() => {
    const saved = loadState<State | null>(null);
    if (saved && saved.jobs && saved.jobs.length > 0) return saved;
    return {
      ...seedData,
      currentUserId: seedData.users[0].id,
      settings: defaultSettings,
    };
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? state.users[0];

  const switchRole = useCallback((role: UserRole) => {
    setState((s) => {
      const user = s.users.find((u) => u.role === role);
      if (!user) return s;
      return { ...s, currentUserId: user.id };
    });
  }, []);

  const addJob = useCallback((job: Omit<Job, 'id' | 'postedAt' | 'applicationCount'>) => {
    setState((s) => ({
      ...s,
      jobs: [
        ...s.jobs,
        { ...job, id: generateId(), postedAt: new Date().toISOString(), applicationCount: 0 },
      ],
    }));
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    }));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setState((s) => ({ ...s, jobs: s.jobs.filter((j) => j.id !== id) }));
  }, []);

  const addCandidate = useCallback((candidate: Omit<Candidate, 'id' | 'appliedAt'>) => {
    setState((s) => ({
      ...s,
      candidates: [
        ...s.candidates,
        { ...candidate, id: generateId(), appliedAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const updateCandidate = useCallback((id: string, updates: Partial<Candidate>) => {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const deleteCandidate = useCallback((id: string) => {
    setState((s) => ({ ...s, candidates: s.candidates.filter((c) => c.id !== id) }));
  }, []);

  const addInterview = useCallback((interview: Omit<Interview, 'id'>) => {
    setState((s) => ({
      ...s,
      interviews: [...s.interviews, { ...interview, id: generateId() }],
    }));
  }, []);

  const updateInterview = useCallback((id: string, updates: Partial<Interview>) => {
    setState((s) => ({
      ...s,
      interviews: s.interviews.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  }, []);

  const deleteInterview = useCallback((id: string) => {
    setState((s) => ({ ...s, interviews: s.interviews.filter((i) => i.id !== id) }));
  }, []);

  const addRequisition = useCallback((req: Omit<Requisition, 'id' | 'createdAt'>) => {
    setState((s) => ({
      ...s,
      requisitions: [
        ...s.requisitions,
        { ...req, id: generateId(), createdAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const updateRequisition = useCallback((id: string, updates: Partial<Requisition>) => {
    setState((s) => ({
      ...s,
      requisitions: s.requisitions.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  }, []);

  const deleteRequisition = useCallback((id: string) => {
    setState((s) => ({ ...s, requisitions: s.requisitions.filter((r) => r.id !== id) }));
  }, []);

  const addReferral = useCallback((ref: Omit<Referral, 'id' | 'createdAt'>) => {
    setState((s) => ({
      ...s,
      referrals: [
        ...s.referrals,
        { ...ref, id: generateId(), createdAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const updateReferral = useCallback((id: string, updates: Partial<Referral>) => {
    setState((s) => ({
      ...s,
      referrals: s.referrals.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  }, []);

  const deleteReferral = useCallback((id: string) => {
    setState((s) => ({ ...s, referrals: s.referrals.filter((r) => r.id !== id) }));
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...updates } }));
  }, []);

  return {
    jobs: state.jobs,
    candidates: state.candidates,
    interviews: state.interviews,
    requisitions: state.requisitions,
    referrals: state.referrals,
    users: state.users,
    currentUser,
    settings: state.settings,
    switchRole,
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
    updateSettings,
  };
}
