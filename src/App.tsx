import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreContext } from '@/context/StoreContext';
import { useStore } from '@/hooks/useStore';
import Layout from '@/components/layout/Layout';
import DashboardPage from '@/pages/DashboardPage';
import JobsPage from '@/pages/JobsPage';
import JobDetailPage from '@/pages/JobDetailPage';
import CandidatesPage from '@/pages/CandidatesPage';
import CandidateDetailPage from '@/pages/CandidateDetailPage';
import InterviewsPage from '@/pages/InterviewsPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import CareersPage from '@/pages/CareersPage';
import RequisitionsPage from '@/pages/RequisitionsPage';
import ReferralsPage from '@/pages/ReferralsPage';

export default function App() {
  const store = useStore();

  return (
    <StoreContext.Provider value={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:jobId" element={<JobDetailPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="candidates/:candidateId" element={<CandidateDetailPage />} />
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="requisitions" element={<RequisitionsPage />} />
            <Route path="referrals" element={<ReferralsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreContext.Provider>
  );
}
