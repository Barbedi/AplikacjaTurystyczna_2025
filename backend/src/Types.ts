interface ErrInterface {
  message: string;
  statusCode?: number | undefined;
  stack?: string;
}

interface Users {
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
export class Err implements ErrInterface {
  constructor(message: string, statusCode?: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
  message: string;
  statusCode?: number | undefined;
  stack?: string;
}

export type { ErrInterface, Users };
