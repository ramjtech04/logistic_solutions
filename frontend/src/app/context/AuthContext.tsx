"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
  setRole: (role: string | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, setToken, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}