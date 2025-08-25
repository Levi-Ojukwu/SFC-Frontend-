"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../lib/api";
import toast from "react-hot-toast";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: "player" | "admin";
  is_verified: boolean;
  team_id?: number;
  team?: {
    id: number;
    name: string;
  };
}

interface RegisterData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  restoreUserFromStorage: () => void; // exposed but only used internally
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Safely load from localStorage without ending loading
  const restoreUserFromStorage = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("user");
      }
    }
  };

  // Verify token with backend and **end loading**
  const verifyToken = async () => {
    const t = localStorage.getItem("token");
    if (!t) {
      setLoading(false);
      return;
    }
    try {
      const resp = await authAPI.me();
      setUser(resp.data.user);
      localStorage.setItem("user", JSON.stringify(resp.data.user));
    } catch (err: any) {
      console.error(
        "AuthContext: Token verification failed:",
        err?.response?.data || err?.message
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreUserFromStorage(); // quick optimistic state
    verifyToken();            // authoritative check -> ends loading
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const resp = await authAPI.login({ username, password });
      const { access_token, user: userData } = resp.data.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);

      if (resp.data.status === "success") {
        toast.success(`Welcome back, ${userData?.username || "User"}!`);
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err?.response?.data || err?.message);
      toast.error(err?.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const resp = await authAPI.register(data);
      toast.success(resp.data.message);
    } catch (err: any) {
      console.error("Registration error:", err?.response?.data || err?.message);
      toast.error(err?.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      const updated = prev ? { ...prev, ...userData } : null;
      if (updated) localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    restoreUserFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
