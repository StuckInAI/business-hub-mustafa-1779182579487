import { useState, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage';
import {
  SEED_USERS,
  SEED_JOBS,
  SEED_CANDIDATES,
  SEED_APPLICATIONS,
  SEED_EMAIL_TEMPLATES,
  SEED_AUTOMATION_RULES,
  SEED_REQUISITIONS,
  SEED_REFERRALS,
} from '@/lib/seedData';
import type {
  User,
  Job,
  Candidate,
  Application,
  EmailTemplate,
  AutomationRule,
  Requisition,
  Referral,
  UserRole,
} from '@/types';

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export type Store = {
  currentUser: User;
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  emailTemplates: EmailTemplate[];
  automationRules: AutomationRule[];
  requisitions: Requisition[];
  referrals: Referral[];

  // Auth
  setCurrentUser: (user: User) => void;

  // Jobs
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => Job;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;

  // Candidates
  addCandidate: (c: Omit<Candidate, 'id' | 'createdAt' | 'applications'>) => Candidate;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;

  // Applications
  addApplication: (app: Omit<Application, 'id' | 'appliedAt' | 'updatedAt' | 'notes' | 'interviews' | 'scorecards' | 'emails'>) => Application;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  moveApplicationStage: (id: string, stageId: string) => void;
  deleteApplication: (id: string) => void;

  // Email Templates
  addEmailTemplate: (t: Omit<EmailTemplate, 'id' | 'createdAt'>) => void;
  updateEmailTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  deleteEmailTemplate: (id: string) => void;

  // Automation
  addAutomationRule: (r: Omit<AutomationRule, 'id' | 'createdAt'>) => void;
  updateAutomationRule: (id: string, updates: Partial<AutomationRule>) => void;
  deleteAutomationRule: (id: string) => void;

  // Requisitions
  addRequisition: (r: Omit<Requisition, 'id' | 'createdAt'>) => void;
  updateRequisition: (id: string, updates: Partial<Requisition>) => void;

  // Referrals
  addReferral: (r: Omit<Referral, 'id' | 'createdAt'>) => void;
  updateReferral: (id: string, updates: Partial<Referral>) => void;

  // Users
  addUser: (u: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  switchRole: (role: UserRole) => void;
};

export function useStore(): Store {
  const [currentUser, setCurrentUserState] = useState<User>(
    () => getItem<User>('ats_current_user', SEED_USERS[0])
  );
  const [users, setUsers] = useState<User[]>(
    () => getItem<User[]>('ats_users', SEED_USERS)
  );
  const [jobs, setJobs] = useState<Job[]>(
    () => getItem<Job[]>('ats_jobs', SEED_JOBS)
  );
  const [candidates, setCandidates] = useState<Candidate[]>(
    () => getItem<Candidate[]>('ats_candidates', SEED_CANDIDATES)
  );
  const [applications, setApplications] = useState<Application[]>(
    () => getItem<Application[]>('ats_applications', SEED_APPLICATIONS)
  );
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(
    () => getItem<EmailTemplate[]>('ats_email_templates', SEED_EMAIL_TEMPLATES)
  );
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(
    () => getItem<AutomationRule[]>('ats_automation_rules', SEED_AUTOMATION_RULES)
  );
  const [requisitions, setRequisitions] = useState<Requisition[]>(
    () => getItem<Requisition[]>('ats_requisitions', SEED_REQUISITIONS)
  );
  const [referrals, setReferrals] = useState<Referral[]>(
    () => getItem<Referral[]>('ats_referrals', SEED_REFERRALS)
  );

  const setCurrentUser = useCallback((user: User) => {
    setCurrentUserState(user);
    setItem('ats_current_user', user);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const roleUser = SEED_USERS.find((u) => u.role === role) || SEED_USERS[0];
    setCurrentUser(roleUser);
  }, [setCurrentUser]);

  // Jobs
  const addJob = useCallback((job: Omit<Job, 'id' | 'createdAt'>): Job => {
    const newJob: Job = { ...job, id: generateId(), createdAt: new Date().toISOString() };
    setJobs((prev) => {
      const next = [...prev, newJob];
      setItem('ats_jobs', next);
      return next;
    });
    return newJob;
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs((prev) => {
      const next = prev.map((j) => (j.id === id ? { ...j, ...updates } : j));
      setItem('ats_jobs', next);
      return next;
    });
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => {
      const next = prev.filter((j) => j.id !== id);
      setItem('ats_jobs', next);
      return next;
    });
  }, []);

  // Candidates
  const addCandidate = useCallback((c: Omit<Candidate, 'id' | 'createdAt' | 'applications'>): Candidate => {
    const newC: Candidate = { ...c, id: generateId(), createdAt: new Date().toISOString(), applications: [] };
    setCandidates((prev) => {
      const next = [...prev, newC];
      setItem('ats_candidates', next);
      return next;
    });
    return newC;
  }, []);

  const updateCandidate = useCallback((id: string, updates: Partial<Candidate>) => {
    setCandidates((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      setItem('ats_candidates', next);
      return next;
    });
  }, []);

  const deleteCandidate = useCallback((id: string) => {
    setCandidates((prev) => {
      const next = prev.filter((c) => c.id !== id);
      setItem('ats_candidates', next);
      return next;
    });
  }, []);

  // Applications
  const addApplication = useCallback(
    (app: Omit<Application, 'id' | 'appliedAt' | 'updatedAt' | 'notes' | 'interviews' | 'scorecards' | 'emails'>): Application => {
      const newApp: Application = {
        ...app,
        id: generateId(),
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: [],
        interviews: [],
        scorecards: [],
        emails: [],
      };
      setApplications((prev) => {
        const next = [...prev, newApp];
        setItem('ats_applications', next);
        return next;
      });
      return newApp;
    },
    []
  );

  const updateApplication = useCallback((id: string, updates: Partial<Application>) => {
    setApplications((prev) => {
      const next = prev.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      );
      setItem('ats_applications', next);
      return next;
    });
  }, []);

  const moveApplicationStage = useCallback((id: string, stageId: string) => {
    setApplications((prev) => {
      const next = prev.map((a) =>
        a.id === id ? { ...a, stageId, updatedAt: new Date().toISOString() } : a
      );
      setItem('ats_applications', next);
      return next;
    });
  }, []);

  const deleteApplication = useCallback((id: string) => {
    setApplications((prev) => {
      const next = prev.filter((a) => a.id !== id);
      setItem('ats_applications', next);
      return next;
    });
  }, []);

  // Email Templates
  const addEmailTemplate = useCallback((t: Omit<EmailTemplate, 'id' | 'createdAt'>) => {
    setEmailTemplates((prev) => {
      const next = [...prev, { ...t, id: generateId(), createdAt: new Date().toISOString() }];
      setItem('ats_email_templates', next);
      return next;
    });
  }, []);

  const updateEmailTemplate = useCallback((id: string, updates: Partial<EmailTemplate>) => {
    setEmailTemplates((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      setItem('ats_email_templates', next);
      return next;
    });
  }, []);

  const deleteEmailTemplate = useCallback((id: string) => {
    setEmailTemplates((prev) => {
      const next = prev.filter((t) => t.id !== id);
      setItem('ats_email_templates', next);
      return next;
    });
  }, []);

  // Automation
  const addAutomationRule = useCallback((r: Omit<AutomationRule, 'id' | 'createdAt'>) => {
    setAutomationRules((prev) => {
      const next = [...prev, { ...r, id: generateId(), createdAt: new Date().toISOString() }];
      setItem('ats_automation_rules', next);
      return next;
    });
  }, []);

  const updateAutomationRule = useCallback((id: string, updates: Partial<AutomationRule>) => {
    setAutomationRules((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
      setItem('ats_automation_rules', next);
      return next;
    });
  }, []);

  const deleteAutomationRule = useCallback((id: string) => {
    setAutomationRules((prev) => {
      const next = prev.filter((r) => r.id !== id);
      setItem('ats_automation_rules', next);
      return next;
    });
  }, []);

  // Requisitions
  const addRequisition = useCallback((r: Omit<Requisition, 'id' | 'createdAt'>) => {
    setRequisitions((prev) => {
      const next = [...prev, { ...r, id: generateId(), createdAt: new Date().toISOString() }];
      setItem('ats_requisitions', next);
      return next;
    });
  }, []);

  const updateRequisition = useCallback((id: string, updates: Partial<Requisition>) => {
    setRequisitions((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
      setItem('ats_requisitions', next);
      return next;
    });
  }, []);

  // Referrals
  const addReferral = useCallback((r: Omit<Referral, 'id' | 'createdAt'>) => {
    setReferrals((prev) => {
      const next = [...prev, { ...r, id: generateId(), createdAt: new Date().toISOString() }];
      setItem('ats_referrals', next);
      return next;
    });
  }, []);

  const updateReferral = useCallback((id: string, updates: Partial<Referral>) => {
    setReferrals((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
      setItem('ats_referrals', next);
      return next;
    });
  }, []);

  // Users
  const addUser = useCallback((u: Omit<User, 'id'>) => {
    setUsers((prev) => {
      const next = [...prev, { ...u, id: generateId() }];
      setItem('ats_users', next);
      return next;
    });
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === id ? { ...u, ...updates } : u));
      setItem('ats_users', next);
      return next;
    });
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => {
      const next = prev.filter((u) => u.id !== id);
      setItem('ats_users', next);
      return next;
    });
  }, []);

  return {
    currentUser,
    users,
    jobs,
    candidates,
    applications,
    emailTemplates,
    automationRules,
    requisitions,
    referrals,
    setCurrentUser,
    addJob,
    updateJob,
    deleteJob,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    addApplication,
    updateApplication,
    moveApplicationStage,
    deleteApplication,
    addEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    addAutomationRule,
    updateAutomationRule,
    deleteAutomationRule,
    addRequisition,
    updateRequisition,
    addReferral,
    updateReferral,
    addUser,
    updateUser,
    deleteUser,
    switchRole,
  };
}
