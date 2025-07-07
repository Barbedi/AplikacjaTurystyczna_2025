import React, { useCallback, useState } from "react";
import AuthContext from "./auth-context";
import authenticationService from "../services/authentication.service";
import { AxiosResponse } from "axios";
import { User } from "../assets/Data";

export interface AuthResponse {
  auth: boolean;
  user: User | undefined;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.ComponentType<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const [auth, setAuth] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);

const refreshUserProfile = () => {
  setProfileRefreshKey((prev) => prev + 1);
};
  const refreshToken = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        authenticationService
          .refreshToken()
          .then((response: AxiosResponse<AuthResponse>) => {
            if (response.status === 200) {
              setAuth(response.data.auth);
              setUser(response.data.user);
              resolve(true);
            }
          })
          .catch((error) => {
            if (error.response.status === 401) {
              console.error("Unauthorized");
            } else if (error.response.status === 500) {
              console.error("Internal Server error");
            }
            resolve(false);
          });
      }),
    [],
  );

  const checkAuth = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        authenticationService
          .authenticate()
          .then((response: AxiosResponse<AuthResponse>) => {
            if (response.status === 200) {
              setAuth(response.data.auth);
              setUser(response.data.user);
              resolve(true);
            }
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status === 401) {
                refreshToken().then((result) => resolve(result));
              } else if (error.response.status === 500) {
                console.error("Internal server error");
                resolve(false);
              }
            }
          });
      }),
    [refreshToken],
  );

  const logout = useCallback(() => {
    authenticationService
      .logout()
      .then((response) => {
        if (response.status === 200) {
          setAuth(false);
          setUser(undefined);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.error("Unauthorized");
        } else if (error.response.status === 500) {
          console.error("Server error");
        }
      });
      
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        setAuth,
        setUser,
        checkAuth,
        refreshToken,
        refreshUserProfile,
        profileRefreshKey,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
