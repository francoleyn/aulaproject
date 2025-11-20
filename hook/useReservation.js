import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// For Android Emulator - use 10.0.2.2 instead of localhost
const API_URL = "http://10.0.2.2:5001/api/reservations";

export const useReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);

  // Get reservations by user ID
  const getReservationsByUserID = async (userID) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/${userID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch reservations");
      }

      setReservations(data);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Create reservation
  const createReservation = async (reservationData) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      console.log("Creating reservation:", reservationData);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create reservation");
      }

      setLoading(false);
      return { success: true, reservation: data.reservations };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Delete reservation
  const deleteReservation = async (reservationId) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/${reservationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete reservation");
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
    getReservationsByUserID,
    createReservation,
    deleteReservation,
    loading,
    error,
    reservations,
  };
};
