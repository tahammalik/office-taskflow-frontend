export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  organization_id: number | null;
  is_active: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
