// mobile/hooks/useUser.js
import { useState, useCallback } from "react";

const API_BASE_URL = "http://localhost:5001/api"; // use http if running locally

export default function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Custom login function
  const login = useCallback(async (userName, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/getUserAccount?userName=${encodeURIComponent(userName)}&password=${encodeURIComponent(password)}`
      );

      if (!response.ok) {
        throw new Error("Failed to login. Please check your credentials.");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setUser(data[0]); // assuming your API returns an array of users
      } else {
        throw new Error("Invalid username or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
}
