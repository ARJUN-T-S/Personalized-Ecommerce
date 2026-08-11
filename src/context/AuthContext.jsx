import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedAdmin = localStorage.getItem('admin');
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('admin');
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider value={{ user, admin, loading, loginUser, logoutUser, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
