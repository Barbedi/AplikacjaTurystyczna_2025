import { createContext } from "react";
import type { Users } from "../assets/Data";

interface AuthContextProps {
  auth: boolean;
  user: Users | undefined;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<Users | undefined>>;
  checkAuth: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext({} as AuthContextProps);

export default AuthContext;
