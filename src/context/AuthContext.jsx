import React from "react";
import { createContext, useEffect, useMemo, useState } from "react";
import {  loginUser, registerUser  } from "../services/authService";
import {  clearToken, getToken, saveToken  } from "../utils/token";

export const AuthContext = createContext(null);

function normalizeUser(data) {
  if (!data) return null;
  return data.user || data;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cp_user") || "null"); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem("cp_user", JSON.stringify(user));
    else localStorage.removeItem("cp_user");
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      const newToken = data.token || data.jwt || data.accessToken;
      if (!newToken) throw new Error("Login succeeded but no authentication token was returned.");
      saveToken(newToken);
      setToken(newToken);
      setUser(normalizeUser(data.user ? data : data));
      return data;
    } finally { setLoading(false); }
  };

  const register = async (payload) => {
    setLoading(true);
    try { return await registerUser(payload); }
    finally { setLoading(false); }
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem("cp_user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  const value = useMemo(() => ({
    user, token, login, logout, register, isAuthenticated: Boolean(token), loading
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
