'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react';
import api from '@/services/api';
import styles from './signup.module.css';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/v1/auth/user-create', {
        username,
        email,
        password
      });

      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detail || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.card}
      >
        <button onClick={() => router.push('/login')} className={styles.backButton}>
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <div className={styles.header}>
          <div className={styles.logo}>
            <ShieldCheck size={40} color="var(--primary)" />
          </div>
          <h1>Join Enterprise</h1>
          <p>Create your personal profile to get started</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Pick a unique username"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Work Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@company.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Min. 8 characters"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={isLoading} className={styles.signupButton}>
            {isLoading ? 'Creating Account...' : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
