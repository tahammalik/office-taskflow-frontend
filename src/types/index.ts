export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  enterprise_id: number | null;
  created_at: string;
}

export interface Enterprise {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  dead_line: string;
  is_active: boolean;
  created_at: string;
  enterprise_id: number;
}

export interface Team {
  id: number;
  team_name: string;
  description: string;
  enterprise_id: number;
  leader_id: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'todo' | 'in_progress' | 'review' | 'done';
  dead_line: string;
  team_id: number;
  assign_to: number;
  created_by: number;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
