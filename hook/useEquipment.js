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

      // First, get room equipment entries
      const { data: roomEquipData, error: roomEquipError } = await supabase
        .from("roomequipments")
        .select("*")
        .eq("roomid", String(roomId));

      if (roomEquipError) {
        throw new Error(roomEquipError.message);
      }

      if (!roomEquipData || roomEquipData.length === 0) {
        setEquipments([]);
        setLoading(false);
        return { success: true, data: [] };
      }

      // Get unique equipment IDs
      const equipmentIds = [...new Set(roomEquipData.map((re) => re.equipmentid))];

      // Fetch equipment details
      const { data: equipmentData, error: equipmentError } = await supabase
        .from("equipments")
        .select("*")
        .in("id", equipmentIds.map(id => parseInt(id)));

      if (equipmentError) {
        throw new Error(equipmentError.message);
      }

      // Combine room equipment with equipment details
      const combined = roomEquipData.map((roomEquip) => {
        const equipment = equipmentData?.find(
          (eq) => String(eq.id) === String(roomEquip.equipmentid)
        );
        return {
          ...roomEquip,
          name: equipment?.name || "Unknown Equipment",
          description: equipment?.description || "",
        };
      });

      setEquipments(combined);
      setLoading(false);
      return { success: true, data: combined };
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

      // First, get room equipment entries
      const { data: roomEquipData, error: roomEquipError } = await supabase
        .from("roomequipments")
        .select("*")
        .eq("roomid", String(roomId));

      if (roomEquipError) {
        throw new Error(roomEquipError.message);
      }

      if (!roomEquipData || roomEquipData.length === 0) {
        setEquipments([]);
        setLoading(false);
        return { success: true, data: [] };
      }

      // Get unique equipment IDs
      const equipmentIds = [...new Set(roomEquipData.map((re) => re.equipmentid))];

      // Fetch equipment details
      const { data: equipmentData, error: equipmentError } = await supabase
        .from("equipments")
        .select("*")
        .in("id", equipmentIds.map(id => parseInt(id)));

      if (equipmentError) {
        throw new Error(equipmentError.message);
      }

      // Combine room equipment with equipment details
      const combined = roomEquipData.map((roomEquip) => {
        const equipment = equipmentData?.find(
          (eq) => String(eq.id) === String(roomEquip.equipmentid)
        );
        return {
          ...roomEquip,
          name: equipment?.name || "Unknown Equipment",
          description: equipment?.description || "",
        };
      });

      setEquipments(combined);
      setLoading(false);
      return { success: true, data: combined };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Check if room equipment exists
  const checkRoomEquipmentExists = async (roomId, equipmentId) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("roomequipments")
        .select("*")
        .eq("roomid", roomId)
        .eq("equipmentid", equipmentId)
        .single();

      if (supabaseError && supabaseError.code !== "PGRST116") {
        throw new Error(supabaseError.message);
      }

      return { exists: !!data, data };
    } catch (err) {
      return { exists: false, error: err.message };
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

  // Add equipment to room (checks if exists first, updates quantity if exists)
  const addEquipmentToRoom = async (roomId, equipmentData) => {
    try {
      setLoading(true);
      setError(null);

      // Check if the room equipment already exists
      const { exists, data: existingData } = await checkRoomEquipmentExists(
        roomId,
        equipmentData.equipmentid
      );

      if (exists) {
        // Update quantity if already exists
        const newQuantity = (existingData.quantity || 0) + (equipmentData.quantity || 1);
        const { data, error: updateError } = await supabase
          .from("roomequipments")
          .update({ quantity: newQuantity })
          .eq("id", existingData.id)
          .select()
          .single();

        if (updateError) {
          throw new Error(updateError.message);
        }

        setLoading(false);
        return { success: true, roomEquipment: data, updated: true };
      }

      // Insert new record if doesn't exist
      const { data, error: supabaseError } = await supabase
        .from("roomequipments")
        .insert({
          roomid: roomId,
          equipmentid: equipmentData.equipmentid,
          quantity: equipmentData.quantity || 1,
        })
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, roomEquipment: data, inserted: true };
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
        .eq("roomid", roomId)
        .eq("equipmentid", equipmentId)
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
        .eq("roomid", roomId)
        .eq("equipmentid", equipmentId);

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
    checkRoomEquipmentExists,
  };
};
