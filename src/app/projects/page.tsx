'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Briefcase, Calendar, Trash2, ExternalLink } from 'lucide-react';
import api from '@/services/api';
import { Project } from '@/types';
import styles from './projects.module.css';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', dead_line: '' });

  const fetchProjects = async () => {
    try {
      const response = await api.get('/v1/projects/show');
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/v1/projects/create', newProject);
      setIsModalOpen(false);
      setNewProject({ title: '', description: '', dead_line: '' });
      fetchProjects();
    } catch (err) {
      alert('Failed to create project');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/v1/projects/delete?project_id=${id}`);
      fetchProjects();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>Manage and track your enterprise projects.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={styles.primaryButton}>
          <Plus size={20} />
          New Project
        </button>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading projects...</div>
      ) : (
        <div className={styles.grid}>
          <AnimatePresence>
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={styles.projectCard}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.projectIcon}>
                    <Briefcase size={20} />
                  </div>
                  <button onClick={() => handleDelete(project.id)} className={styles.deleteButton}>
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDesc}>{project.description}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.deadline}>
                    <Calendar size={14} />
                    <span>{new Date(project.dead_line).toLocaleDateString()}</span>
                  </div>
                  <button className={styles.viewButton}>
                    Details
                    <ExternalLink size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={styles.modal}
            >
              <h2>Create New Project</h2>
              <form onSubmit={handleCreate} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Project Title</label>
                  <input 
                    type="text" 
                    value={newProject.title} 
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Description</label>
                  <textarea 
                    value={newProject.description} 
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Deadline</label>
                  <input 
                    type="datetime-local" 
                    value={newProject.dead_line} 
                    onChange={(e) => setNewProject({...newProject, dead_line: e.target.value})}
                    required 
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>Cancel</button>
                  <button type="submit" className={styles.submitButton}>Create Project</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
