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
      // Backend usually returns error in detail or message field
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || 'Failed to create account';
      setError(errorMessage);
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
            <ShieldCheck size={40} className="text-blue-600" />
          </div>
          <h1>Create Account</h1>
          <p>Join TaskFlow to manage your projects effectively.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Pick a unique username"
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Work Email</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@company.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={styles.error}
            >
              {error}
            </motion.div>
          )}

          <button type="submit" disabled={isLoading} className={styles.signupButton}>
            {isLoading ? (
              <div className={styles.spinner}></div>
            ) : (
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
