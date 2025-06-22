export interface Users {
  id?: number;
  email: string;
  password: string;
  name: string;
  level_of_experience?: string;
  fitness_level?: string;
  created_at?: string;
  salt?: string;
  role?: string;
}
