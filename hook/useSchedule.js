import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  // For Expo Go, use the debugger host
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();

  if (debuggerHost) {
    return `http://${debuggerHost}:5001/api/schedules`;
  }

  // Fallback for emulator
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5001/api/schedules";
  }

  // iOS simulator
  return "http://localhost:5001/api/schedules";
};

const API_URL = getApiUrl();

export const useSchedule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);

  // Get all schedules
  const getAllSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch schedules");
      }

      setSchedules(data.schedules);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get schedule by ID
  const getScheduleById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch schedule");
      }

      setLoading(false);
      return { success: true, schedule: data.schedule };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get schedules by room
  const getSchedulesByRoom = async (roomId) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/room/${roomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch room schedules");
      }

      setSchedules(data.schedules);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get schedules by day of week
  const getSchedulesByDay = async (day) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/day/${day}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch schedules by day");
      }

      setSchedules(data.schedules);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get schedules by room and day (UPDATED - this is the key fix!)
  const getSchedulesByRoomAndDay = async (roomId, day) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      console.log("Fetching schedules for room:", roomId, "day:", day);

      const response = await fetch(`${API_URL}/room/${roomId}/day/${day}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Schedule API response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch room schedules");
      }

      setSchedules(data.schedules || []);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      console.error("Schedule fetch error:", err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Alias for backward compatibility
  const getSchedulesByRoomAndDate = getSchedulesByRoomAndDay;

  // Create schedule
  const createSchedule = async (scheduleData) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      console.log("Creating schedule:", scheduleData);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create schedule");
      }

      setLoading(false);
      return { success: true, schedule: data.schedule };
    } catch (err) {
      ``;
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Update schedule
  const updateSchedule = async (id, scheduleData) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update schedule");
      }

      setLoading(false);
      return { success: true, schedule: data.schedule };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Delete schedule
  const deleteSchedule = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete schedule");
      }

      setLoading(false);
      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return {
    schedules,
    loading,
    error,
    getAllSchedules,
    getScheduleById,
    getSchedulesByRoom,
    getSchedulesByDay,
    getSchedulesByRoomAndDay,
    getSchedulesByRoomAndDate, // For backward compatibility
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
};
