import { useState } from 'react';
import { loadState, saveState } from '@/lib/storage';
import { seedData } from '@/lib/seedData';
import type {
  StoreState,
  Job,
  Candidate,
  Application,
  Interview,
  Requisition,
  Referral,
  UserRole,
} from '@/types';

function getInitialState(): StoreState {
  const saved = loadState();
  if (saved) return saved;
  return seedData;
}

export function useStore() {
  const [state, setState] = useState<StoreState>(getInitialState);

  function update(next: Partial<StoreState>) {
    setState((prev) => {
      const merged = { ...prev, ...next };
      saveState(merged);
      return merged;
    });
  }

  function switchRole(role: UserRole) {
    const user = state.users.find((u) => u.role === role) || {
      ...state.currentUser,
      role,
    };
    update({ currentUser: user });
  }

  function addJob(job: Omit<Job, 'id' | 'createdAt'>) {
    const newJob: Job = {
      ...job,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    update({ jobs: [...state.jobs, newJob] });
  }

  function updateJob(id: string, patch: Partial<Job>) {
    update({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
    });
  }

  function deleteJob(id: string) {
    update({ jobs: state.jobs.filter((j) => j.id !== id) });
  }

  function addCandidate(candidate: Omit<Candidate, 'id' | 'createdAt'>) {
    const newCandidate: Candidate = {
      ...candidate,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    update({ candidates: [...state.candidates, newCandidate] });
  }

  function updateCandidate(id: string, patch: Partial<Candidate>) {
    update({
      candidates: state.candidates.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  }

  function deleteCandidate(id: string) {
    update({ candidates: state.candidates.filter((c) => c.id !== id) });
  }

  function addApplication(application: Omit<Application, 'id' | 'createdAt'>) {
    const newApp: Application = {
      ...application,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    update({ applications: [...state.applications, newApp] });
  }

  function updateApplication(id: string, patch: Partial<Application>) {
    update({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, ...patch } : a
      ),
    });
  }

  function addInterview(interview: Omit<Interview, 'id' | 'createdAt'>) {
    const newInterview: Interview = {
      ...interview,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    update({ interviews: [...state.interviews, newInterview] });
  }

  function updateInterview(id: string, patch: Partial<Interview>) {
    update({
      interviews: state.interviews.map((i) =>
        i.id === id ? { ...i, ...patch } : i
      ),
    });
  }

  function addRequisition(requisition: Omit<Requisition, 'id' | 'createdAt' | 'updatedAt'>) {
    const newReq: Requisition = {
      ...requisition,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    update({ requisitions: [...state.requisitions, newReq] });
  }

  function updateRequisition(id: string, patch: Partial<Requisition>) {
    update({
      requisitions: state.requisitions.map((r) =>
        r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r
      ),
    });
  }

  function addReferral(referral: Omit<Referral, 'id' | 'createdAt'>) {
    const newReferral: Referral = {
      ...referral,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    update({ referrals: [...state.referrals, newReferral] });
  }

  function updateReferral(id: string, patch: Partial<Referral>) {
    update({
      referrals: state.referrals.map((r) =>
        r.id === id ? { ...r, ...patch } : r
      ),
    });
  }

  return {
    ...state,
    switchRole,
    addJob,
    updateJob,
    deleteJob,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    addApplication,
    updateApplication,
    addInterview,
    updateInterview,
    addRequisition,
    updateRequisition,
    addReferral,
    updateReferral,
  };
}
