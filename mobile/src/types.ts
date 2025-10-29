export interface User {
    id: number;
    email: string;
    role: string;
  }
  
  export interface AuthResponse {
    auth: boolean;
    user: User;
    token?: string;
    refreshToken?: string;
  }