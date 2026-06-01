'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  CheckSquare, 
  Settings, 
  LogOut,
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './sidebar.module.css';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <ShieldCheck size={32} color="var(--primary)" />
        <span className={styles.brand}>TaskFlow</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button onClick={toggleTheme} className={styles.themeToggle}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <p className={styles.username}>{user?.username || 'Guest'}</p>
            <p className={styles.role}>{user?.role || 'User'}</p>
          </div>
          <button onClick={logout} className={styles.logoutButton} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
