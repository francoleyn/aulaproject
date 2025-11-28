import { useState } from "react";
import { supabase } from "../lib/supabase";

export const useEquipment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [equipments, setEquipments] = useState([]);

  // Get all equipments
  const getAllEquipments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("equipments")
        .select("*");

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setEquipments(data || []);
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

      const { data, error: supabaseError } = await supabase
        .from("equipments")
        .select("*")
        .eq("id", id)
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, equipment: data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get room equipments (via roomequipments join table)
  const getRoomEquipments = async (roomId) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("roomequipments")
        .select("*, equipments(*)")
        .eq("room_id", roomId);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setEquipments(data || []);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get room details with equipments
  const getRoomDetails = async (roomId) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("roomequipments")
        .select("*, equipments(*)")
        .eq("room_id", roomId);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setEquipments(data || []);
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

      const { data, error: supabaseError } = await supabase
        .from("equipments")
        .insert(equipmentData)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, equipment: data };
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

      const { data, error: supabaseError } = await supabase
        .from("equipments")
        .update(equipmentData)
        .eq("id", id)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, equipment: data };
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

      const { error: supabaseError } = await supabase
        .from("equipments")
        .delete()
        .eq("id", id);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, message: "Equipment deleted successfully" };
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

      const { data, error: supabaseError } = await supabase
        .from("roomequipments")
        .insert({
          room_id: roomId,
          equipment_id: equipmentData.equipment_id,
          quantity: equipmentData.quantity || 1,
        })
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, roomEquipment: data };
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

      const { data, error: supabaseError } = await supabase
        .from("roomequipments")
        .update({ quantity })
        .eq("room_id", roomId)
        .eq("equipment_id", equipmentId)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, roomEquipment: data };
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

      const { error: supabaseError } = await supabase
        .from("roomequipments")
        .delete()
        .eq("room_id", roomId)
        .eq("equipment_id", equipmentId);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, message: "Equipment removed from room" };
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
