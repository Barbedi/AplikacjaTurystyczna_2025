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
            console.log("❌ Refresh token failed:", error.response?.status, error.response?.data);
            // Gdy refresh token nie działa, wyloguj użytkownika
            setAuth(false);
            setUser(undefined);
            if (error.response?.status === 401) {
              console.error("Refresh token expired - logging out");
            } else if (error.response?.status === 500) {
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
            console.log("❌ Auth check failed:", error.response?.status, error.response?.data);
            if (error.response) {
              if (error.response.status === 401) {
                console.log("🔄 Trying refresh token...");
                refreshToken().then((result) => resolve(result));
              } else if (error.response.status === 500) {
                console.error("Internal server error");
                resolve(false);
              } else {
                // Inne błędy - wyloguj
                setAuth(false);
                setUser(undefined);
                resolve(false);
              }
            } else {
              // Brak odpowiedzi (serwer wyłączony) - wyloguj
              console.log("🚫 No response from server - logging out");
              setAuth(false);
              setUser(undefined);
              resolve(false);
            }
          });
      }),
    [refreshToken],
  );

  const logout = useCallback(() => {
    console.log("🚪 Logging out...");
    authenticationService
      .logout()
      .then((response) => {
        if (response.status === 200) {
          console.log("✅ Logout successful");
          setAuth(false);
          setUser(undefined);
        }
      })
      .catch((error) => {
        console.log("❌ Logout error:", error.response?.status);
        // Nawet jeśli logout się nie powiódł, wyczyść stan lokalny
        setAuth(false);
        setUser(undefined);
        if (error.response?.status === 401) {
          console.error("Unauthorized during logout");
        } else if (error.response?.status === 500) {
          console.error("Server error during logout");
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
