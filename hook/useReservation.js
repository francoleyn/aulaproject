import { useState } from "react";
import { supabase } from "../lib/supabase";

export const useReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);

  // Get reservations by user ID
  const getReservationsByUserID = async (userID) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("reservations")
        .select("*")
        .eq("userid", userID);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setReservations(data || []);
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

      const { data, error: supabaseError } = await supabase
        .from("reservations")
        .insert(reservationData)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, reservation: data };
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

      const { error: supabaseError } = await supabase
        .from("reservations")
        .delete()
        .eq("id", reservationId);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, message: "Reservation deleted successfully" };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get reservations by room ID (shows all reservations for a room)
  const getReservationsByRoom = async (roomId) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("reservations")
        .select("*")
        .eq("roomid", roomId)
        .order("date", { ascending: true });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, data: data || [] };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get reservations by room and date
  const getReservationsByRoomAndDate = async (roomId, date) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("reservations")
        .select("*")
        .eq("roomid", roomId)
        .eq("date", date);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, data: data || [] };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get approved reservations for a user (for notifications)
  const getApprovedReservations = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("reservations")
        .select("*")
        .eq("userid", userId)
        .eq("status", true)
        .order("created_at", { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, data: data || [] };
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
    getReservationsByRoom,
    getReservationsByRoomAndDate,
    getApprovedReservations,
    loading,
    error,
    reservations,
  };
};
