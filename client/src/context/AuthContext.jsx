import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { authApi.me().then(({ user }) => setUser(user)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const value = { user, loading, signIn: async (method, values) => { const response = await authApi[method](values); setUser(response.user); }, signOut: async () => { await authApi.logout(); setUser(null); } };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
