'use client';

import React, { useEffect, useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import api from '@/services/api';
import { Task } from '@/types';
import styles from './tasks.module.css';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/v1/task/tasks');
        setTasks(response.data);
      } catch (err) {
        console.error('Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Task Board</h1>
          <p className={styles.subtitle}>Track and manage your team's workflow.</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input type="text" placeholder="Search tasks..." />
          </div>
          <button className={styles.primaryButton}>
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading tasks...</div>
      ) : (
        <div className={styles.board}>
          {COLUMNS.map((column) => (
            <div key={column.id} className={styles.column}>
              <div className={styles.columnHeader}>
                <div className={styles.columnTitle}>
                  <h3>{column.title}</h3>
                  <span className={styles.count}>{getTasksByStatus(column.id).length}</span>
                </div>
                <button className={styles.iconButton}>
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className={styles.taskList}>
                {getTasksByStatus(column.id).map((task) => (
                  <motion.div 
                    key={task.id}
                    layoutId={String(task.id)}
                    className={styles.taskCard}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className={styles.taskTitle}>{task.title}</h4>
                    <p className={styles.taskDesc}>{task.description}</p>
                    
                    <div className={styles.taskMeta}>
                      <div className={styles.metaItem}>
                        <Calendar size={12} />
                        <span>{new Date(task.dead_line).toLocaleDateString()}</span>
                      </div>
                      <div className={styles.assignee}>
                        <div className={styles.avatar}>
                          <UserIcon size={12} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {getTasksByStatus(column.id).length === 0 && (
                  <div className={styles.emptyState}>No tasks</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
