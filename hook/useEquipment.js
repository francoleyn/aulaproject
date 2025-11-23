import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  // For Expo Go, use the debugger host
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();

  if (debuggerHost) {
    return `http://${debuggerHost}:5001/api/room`;
  }

  // Fallback for emulator
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5001/api/room";
  }

  // iOS simulator
  return "http://localhost:5001/api/room";
};

const API_URL = getApiUrl();

export const useEquipment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [equipments, setEquipments] = useState([]);

  // Get all equipments
  const getAllEquipments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/equipments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch equipments");
      }

      setEquipments(data.equipments);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get equipment by ID
  const getEquipmentById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/equipments/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch equipment");
      }

      setLoading(false);
      return { success: true, equipment: data.equipment };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get room equipments
  const getRoomEquipments = async (roomId) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/${roomId}/equipments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch room equipments");
      }

      setEquipments(data.equipments);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get room details with equipments (for Room Details Modal)
  const getRoomDetails = async (roomId) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/${roomId}/details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch room details");
      }

      setEquipments(data.equipments);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Create equipment
  const createEquipment = async (equipmentData) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      console.log("Creating equipment:", equipmentData);

      const response = await fetch(`${API_URL}/equipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(equipmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create equipment");
      }

      setLoading(false);
      return { success: true, equipment: data.equipment };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Update equipment
  const updateEquipment = async (id, equipmentData) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/equipments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(equipmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update equipment");
      }

      setLoading(false);
      return { success: true, equipment: data.equipment };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Delete equipment
  const deleteEquipment = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/equipments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete equipment");
      }

      setLoading(false);
      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Add equipment to room
  const addEquipmentToRoom = async (roomId, equipmentData) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      console.log("Adding equipment to room:", roomId, equipmentData);

      const response = await fetch(`${API_URL}/${roomId}/equipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(equipmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add equipment to room");
      }

      setLoading(false);
      return { success: true, roomEquipment: data.roomEquipment };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Update room equipment quantity
  const updateRoomEquipment = async (roomId, equipmentId, quantity) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${roomId}/equipments/${equipmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update room equipment");
      }

      setLoading(false);
      return { success: true, roomEquipment: data.roomEquipment };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Remove equipment from room
  const removeEquipmentFromRoom = async (roomId, equipmentId) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${roomId}/equipments/${equipmentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove equipment from room");
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
    equipments,
    loading,
    error,
    getAllEquipments,
    getEquipmentById,
    getRoomEquipments,
    getRoomDetails,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    addEquipmentToRoom,
    updateRoomEquipment,
    removeEquipmentFromRoom,
  };
};
