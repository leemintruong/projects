import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // quan trọng để gửi cookie session

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000";

  // Lấy user hiện tại khi load app
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/auth/me`);
      const token = localStorage.getItem("token");

axios.get("http://localhost:5000/api/auth/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signIn = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/signin`, { email, password });
      setUser(data.user);
      return { user: data.user };
    } catch (err) {
      return { user: null, error: err.response?.data || { message: "Đăng nhập thất bại" } };
    }
  };

  const signUp = async (fullName, email, password, role) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/signup`, { fullName, email, password, role });
      setUser(data.user);
      return { user: data.user };
    } catch (err) {
      return { user: null, error: err.response?.data || { message: "Đăng ký thất bại" } };
    }
  };

  const signOut = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/signout`);
      setUser(null);
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
