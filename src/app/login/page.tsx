'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post('/v1/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      await login(response.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      // Backend usually returns error in detail or message field
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || 'Invalid username or password';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.card}
      >
        <div className={styles.header}>
          <div className={styles.logo}>
            <ShieldCheck size={40} className="text-blue-600" />
          </div>
          <h1>TaskFlow</h1>
          <p>Welcome back! Please sign in to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required
              autoComplete="current-password"
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

          <button type="submit" disabled={isLoading} className={styles.loginButton}>
            {isLoading ? (
              <div className={styles.spinner}></div>
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Don't have an account yet?</p>
          <button onClick={() => router.push('/signup')} className={styles.signupLink}>
            <UserPlus size={18} />
            Create an Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
