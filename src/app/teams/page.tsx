'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Shield, User } from 'lucide-react';
import api from '@/services/api';
import { Team } from '@/types';
import styles from './teams.module.css';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get('/v1/teams/show');
        setTeams(response.data);
      } catch (err) {
        console.error('Failed to fetch teams');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Teams</h1>
          <p className={styles.subtitle}>Collaborate with your enterprise departments.</p>
        </div>
        <button className={styles.primaryButton}>
          <Plus size={20} />
          Create Team
        </button>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading teams...</div>
      ) : (
        <div className={styles.grid}>
          {teams.map((team, i) => (
            <motion.div 
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={styles.teamCard}
            >
              <div className={styles.teamHeader}>
                <div className={styles.teamIcon}>
                  <Users size={24} />
                </div>
                <div className={styles.teamBadge}>Active</div>
              </div>
              <h3 className={styles.teamName}>{team.team_name}</h3>
              <p className={styles.teamDesc}>{team.description}</p>
              
              <div className={styles.teamFooter}>
                <div className={styles.leaderInfo}>
                  <Shield size={14} />
                  <span>Leader ID: {team.leader_id}</span>
                </div>
                <div className={styles.memberCount}>
                  <User size={14} />
                  <span>12 Members</span>
                </div>
              </div>
            </motion.div>
          ))}
          {teams.length === 0 && (
            <div className={styles.empty}>No teams found. Create one to get started.</div>
          )}
        </div>
      )}
    </div>
  );
}
