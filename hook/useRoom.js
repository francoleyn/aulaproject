import { useState } from "react";
import { supabase } from "../lib/supabase";

export const useRoom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);

  // Get all rooms
  const getRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("rooms")
        .select("*");

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setRooms(data || []);
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

      const { roomNum, floorNum, capacity, status, bldg } = roomData;

      // Validate input
      if (!roomNum || !floorNum || !capacity || status === undefined) {
        throw new Error("All fields are required");
      }

      const { data, error: supabaseError } = await supabase
        .from("rooms")
        .insert({
          roomnum: roomNum,
          floornum: floorNum,
          capacity: capacity,
          status: status,
          bldg: bldg,
        })
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Refresh room list
      await getRooms();

      setLoading(false);
      return { success: true, room: data };
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

      const { data, error: supabaseError } = await supabase
        .from("rooms")
        .update(roomData)
        .eq("id", id)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Refresh room list
      await getRooms();

      setLoading(false);
      return { success: true, room: data };
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

      const { error: supabaseError } = await supabase
        .from("rooms")
        .delete()
        .eq("id", id);

      if (supabaseError) {
        throw new Error(supabaseError.message);
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

      const { error: supabaseError } = await supabase
        .from("rooms")
        .update({ status: !currentStatus })
        .eq("id", id);

      if (supabaseError) {
        throw new Error(supabaseError.message);
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
