import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('hms_user')); } catch { return null; }
  });

  // ─── LOGIN ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (role, emailOrId, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrId, password }),
      });

      const data = await response.json();

      if (!data.success) {
        return { success: false, error: data.message || 'Invalid credentials' };
      }

      // Check role matches
      if (data.user.role !== role) {
        return { success: false, error: `This account is not a ${role} account` };
      }

      const userData = { ...data.user, token: data.token };
      setUser(userData);
      sessionStorage.setItem('hms_user', JSON.stringify(userData));
      localStorage.setItem('hms_token', data.token);

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Cannot connect to server. Please try again.' };
    }
  }, []);

  // ─── REGISTER PATIENT ────────────────────────────────────────────────────────
  const registerPatient = useCallback(async (formData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register/patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, message: 'Cannot connect to server' };
    }
  }, []);

  // ─── REGISTER DOCTOR ─────────────────────────────────────────────────────────
  const registerDoctor = useCallback(async (formData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register/doctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, message: 'Cannot connect to server' };
    }
  }, []);

  // ─── LOGOUT ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('hms_user');
    localStorage.removeItem('hms_token');
  }, []);

  // ─── GET AUTH HEADER ─────────────────────────────────────────────────────────
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('hms_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  return (
    <AuthContext.Provider value={{
      user, login, logout, registerPatient, registerDoctor,
      getAuthHeader, isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
