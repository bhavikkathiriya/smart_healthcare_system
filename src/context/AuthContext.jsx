import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const DUMMY_CREDENTIALS = {
  patient: { id: 'patient123', password: 'patient@123', role: 'patient', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'AJ' },
  doctor: { id: 'doctor123', password: 'doctor@123', role: 'doctor', name: 'Dr. Sarah Mitchell', email: 'sarah@medicare.com', avatar: 'SM' },
  admin: { id: 'admin123', password: 'admin@123', role: 'admin', name: 'Admin User', email: 'admin@medicare.com', avatar: 'AU' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('hms_user')); } catch { return null; }
  });

  const login = useCallback((role, id, password) => {
    const creds = DUMMY_CREDENTIALS[role];
    if (creds && creds.id === id && creds.password === password) {
      const userData = { ...creds };
      setUser(userData);
      sessionStorage.setItem('hms_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Please try again.' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('hms_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
