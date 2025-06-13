 export interface Users {
  id?: number;
  email: string;
  password_hash: string;
  name: string;
  level_of_experience?: string;
  fitness_level?: string;
  created_at?: string;
  salt?: string;
}