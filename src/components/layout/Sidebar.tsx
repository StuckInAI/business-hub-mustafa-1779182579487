import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Globe,
  ClipboardList,
  Gift,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { useStoreContext } from '@/context/StoreContext';
import { getInitials } from '@/lib/utils';
import type { UserRole } from '@/types';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/candidates', icon: Users, label: 'Candidates' },
  { to: '/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/requisitions', icon: ClipboardList, label: 'Requisitions' },
  { to: '/referrals', icon: Gift, label: 'Referrals' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'hiring_manager', label: 'Hiring Manager' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'interviewer', label: 'Interviewer' },
];

export default function Sidebar() {
  const { currentUser, switchRole } = useStoreContext();
  const [showRolePicker, setShowRolePicker] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Briefcase size={20} />
        </div>
        <span className={styles.brandName}>TalentFlow</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [styles.navItem, isActive ? styles.active : ''].join(' ')
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
        <a
          href="/careers"
          target="_blank"
          rel="noreferrer"
          className={styles.navItem}
        >
          <Globe size={18} />
          <span>Careers Page</span>
        </a>
      </nav>

      <div className={styles.userSection}>
        <button
          className={styles.userButton}
          onClick={() => setShowRolePicker((v) => !v)}
        >
          <div className={styles.avatar}>{getInitials(currentUser.name)}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{currentUser.name}</span>
            <span className={styles.userRole}>{currentUser.role.replace('_', ' ')}</span>
          </div>
          <ChevronDown size={16} />
        </button>

        {showRolePicker && (
          <div className={styles.roleDropdown}>
            <div className={styles.roleDropdownHeader}>Switch Role (Demo)</div>
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={[
                  styles.roleOption,
                  currentUser.role === opt.value ? styles.roleActive : '',
                ].join(' ')}
                onClick={() => {
                  switchRole(opt.value);
                  setShowRolePicker(false);
                }}
              >
                {opt.label}
              </button>
            ))}
            <button
              className={styles.roleOption}
              onClick={() => {
                setShowRolePicker(false);
                navigate('/careers');
              }}
            >
              <LogOut size={14} style={{ marginRight: 6 }} />
              View Careers Page
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
