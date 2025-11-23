import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  // For Expo Go, use the debugger host
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();

  if (debuggerHost) {
    return `http://${debuggerHost}:5001/api/rooms`;
  }

  // Fallback for emulator
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5001/api/rooms";
  }

  // iOS simulator
  return "http://localhost:5001/api/rooms";
};

const API_URL = getApiUrl();
export const useRoom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);

  // Get all rooms
  const getRooms = async () => {
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
        throw new Error(data.message || "Failed to fetch rooms");
      }

      setRooms(data);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Create new room
  const createRoom = async (roomData) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");
      const { roomNum, floorNum, capacity, status } = roomData;

      // Validate input
      if (!roomNum || !floorNum || !capacity || status === undefined) {
        throw new Error("All fields are required");
      }

      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomNum,
          floorNum,
          capacity,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create room");
      }

      // Refresh room list
      await getRooms();

      setLoading(false);
      return { success: true, room: data.rooms };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Update room
  const updateRoom = async (id, roomData) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update room");
      }

      // Refresh room list
      await getRooms();

      setLoading(false);
      return { success: true, room: data.room };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Delete room
  const deleteRoom = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete room");
      }

      // Refresh room list
      await getRooms();

      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Toggle room status
  const toggleRoomStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: !currentStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to toggle room status");
      }

      // Refresh room list
      await getRooms();

      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get available rooms count
  const getAvailableRoomsCount = () => {
    return rooms.filter((room) => room.status === true).length;
  };

  // Get rooms by floor
  const getRoomsByFloor = (floorNum) => {
    return rooms.filter((room) => room.floornum === floorNum);
  };

  return {
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    toggleRoomStatus,
    getAvailableRoomsCount,
    getRoomsByFloor,
    loading,
    error,
    rooms,
  };
};
