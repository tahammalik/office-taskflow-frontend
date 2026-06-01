'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Briefcase, 
  Users, 
  CheckSquare, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import styles from './page.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    projects: 0,
    teams: 0,
    tasks: 0,
    completed: 0
  });

  useEffect(() => {
    // If user has no enterprise, redirect to onboarding
    if (user && !user.enterprise_id) {
      router.push('/onboarding');
    }
  }, [user, router]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, {user?.username}</h1>
          <p className={styles.subtitle}>Here's what's happening in your enterprise today.</p>
        </div>
        <button onClick={() => router.push('/tasks')} className={styles.primaryButton}>
          <Plus size={20} />
          Create Task
        </button>
      </header>

      <section className={styles.statsGrid}>
        {[
          { label: 'Active Projects', value: '12', icon: Briefcase, color: '#3b82f6' },
          { label: 'Total Teams', value: '4', icon: Users, color: '#8b5cf6' },
          { label: 'Pending Tasks', value: '28', icon: CheckSquare, color: '#f59e0b' },
          { label: 'Completion Rate', value: '84%', icon: TrendingUp, color: '#10b981' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={styles.statCard}
          >
            <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>{stat.label}</p>
              <h3 className={styles.statValue}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      <div className={styles.contentGrid}>
        <div className={styles.recentActivity}>
          <div className={styles.sectionHeader}>
            <h2>Recent Activity</h2>
            <button className={styles.textButton}>View All</button>
          </div>
          <div className={styles.activityList}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={styles.activityItem}>
                <div className={styles.activityAvatar}>JD</div>
                <div className={styles.activityContent}>
                  <p><strong>John Doe</strong> moved <strong>Project Alpha</strong> to <span>Review</span></p>
                  <span className={styles.activityTime}><Clock size={12} /> 2 hours ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.upcomingDeadlines}>
          <div className={styles.sectionHeader}>
            <h2>Upcoming Deadlines</h2>
          </div>
          <div className={styles.deadlineList}>
            {[
              { task: 'Database Migration', date: 'Oct 24', priority: 'High' },
              { task: 'UI Review', date: 'Oct 26', priority: 'Medium' },
              { task: 'Client Presentation', date: 'Oct 30', priority: 'High' },
            ].map((item) => (
              <div key={item.task} className={styles.deadlineItem}>
                <div className={styles.deadlineInfo}>
                  <p className={styles.deadlineTask}>{item.task}</p>
                  <p className={styles.deadlineDate}>{item.date}</p>
                </div>
                <span className={`${styles.priorityTag} ${styles[item.priority.toLowerCase()]}`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
