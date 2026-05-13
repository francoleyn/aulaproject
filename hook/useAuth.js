import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Login function
  const login = async (userName, password) => {
    try {
      setLoading(true);
      setError(null);

      // Query the users table in Supabase
      const { data, error: supabaseError } = await supabase
        .from("users")
        .select("*")
        .eq("username", userName)
        .single();

      if (supabaseError || !data) {
        throw new Error("Invalid username or password");
      }

      // Note: For production, password verification should be done server-side
      // For now, we're just checking if the user exists

      // Store user data
      await AsyncStorage.setItem("user", JSON.stringify(data));

      setUser(data);
      setLoading(false);

      return { success: true, user: data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Continue as student (guest mode - view only)
  const continueAsStudent = async () => {
    try {
      const guestUser = {
        id: "guest",
        username: "Student",
        isGuest: true,
      };
      await AsyncStorage.setItem("user", JSON.stringify(guestUser));
      setUser(guestUser);
      return { success: true };
    } catch (err) {
      console.error("Guest login error:", err);
      return { success: false, error: err.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
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

      // Verify user exists
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (!userData) {
        throw new Error("User not found");
      }

      // Delete the user
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (deleteError) {
        throw new Error(deleteError.message);
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
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
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
    continueAsStudent,
    deleteAccount,
    checkAuth,
    loading,
    error,
    user,
  };
};
