'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import styles from './onboarding.module.css';

export default function OnboardingPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    if (user?.enterprise_id) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/v1/enterprise/create', {
        name,
        email
      });

      // Refresh user state to get the new enterprise_id
      await refreshUser();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create enterprise');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.card}
      >
        <div className={styles.header}>
          <div className={styles.logo}>
            <ShieldCheck size={48} color="var(--primary)" />
          </div>
          <h1>Welcome, {user?.username}</h1>
          <p>You're not part of an enterprise yet. Create one to start managing your projects.</p>
        </div>

        <div className={styles.options}>
          <div className={styles.optionCard}>
            <div className={styles.optionIcon}>
              <Plus size={32} />
            </div>
            <h3>Create New Enterprise</h3>
            <p>Start a new corporate space for your company and invite your team.</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Enterprise Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Acme Corp"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Enterprise Work Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="contact@acme.com"
                  required
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" disabled={isLoading} className={styles.submitButton}>
                {isLoading ? 'Setting up...' : (
                  <>
                    Initialize Enterprise
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
