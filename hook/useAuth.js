import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  // For Expo Go, use the debugger host
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();

  if (debuggerHost) {
    return `http://${debuggerHost}:5001/api/users`;
  }

  // Fallback for emulator
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5001/api/users";
  }

  // iOS simulator
  return "http://localhost:5001/api/users";
};

const API_URL = getApiUrl();

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Login function
  const login = async (userName, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Attempting login to:", `${API_URL}/login`);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user data
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setLoading(false);

      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Delete account function
  const deleteAccount = async (userId, password) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      // Clear local storage after deletion
      await logout();

      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Check if user is logged in
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");

      if (token && userData) {
        setUser(JSON.parse(userData));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Auth check error:", err);
      return false;
    }
  };

  return {
    login,
    logout,
    deleteAccount,
    checkAuth,
    loading,
    error,
    user,
  };
};
