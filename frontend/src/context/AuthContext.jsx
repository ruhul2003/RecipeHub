'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import API from '@/lib/api';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '651649176220-q5so4g0crdg2da9qacs9cvpk3865ksrm.apps.googleusercontent.com';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password, image) => {
    try {
      const res = await API.post('/auth/register', { name, email, password, image });
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Registration successful! Welcome to RecipeHub 🎉');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const googleLogin = async (googleData) => {
    try {
      const res = await API.post('/auth/google', googleData);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success(`Welcome, ${res.data.user.name}!`);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Google Login failed.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully.');
    } catch (err) {
      toast.error('Logout error.');
    }
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider
        value={{
          user,
          loading,
          login,
          register,
          googleLogin,
          logout,
          fetchUser,
          updateUserProfile,
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export const useAuth = () => useContext(AuthContext);
