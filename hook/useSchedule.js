import { useState } from "react";
import { supabase } from "../lib/supabase";

export const useSchedule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);

  // Get all schedules
  const getAllSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("schedules")
        .select("*");

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setSchedules(data || []);
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

      const { data, error: supabaseError } = await supabase
        .from("schedules")
        .select("*")
        .eq("id", id)
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, schedule: data };
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

      const { data, error: supabaseError } = await supabase
        .from("schedules")
        .select("*")
        .eq("roomid", roomId);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setSchedules(data || []);
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

      const { data, error: supabaseError } = await supabase
        .from("schedules")
        .select("*")
        .eq("dayofweek", day);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setSchedules(data || []);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get schedules by room and day
  const getSchedulesByRoomAndDay = async (roomId, day) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("schedules")
        .select("*")
        .eq("roomid", roomId)
        .eq("dayofweek", day);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setSchedules(data || []);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
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

      const { data, error: supabaseError } = await supabase
        .from("schedules")
        .insert(scheduleData)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, schedule: data };
    } catch (err) {
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

      const { data, error: supabaseError } = await supabase
        .from("schedules")
        .update(scheduleData)
        .eq("id", id)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, schedule: data };
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

      const { error: supabaseError } = await supabase
        .from("schedules")
        .delete()
        .eq("id", id);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLoading(false);
      return { success: true, message: "Schedule deleted successfully" };
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
    getSchedulesByRoomAndDate,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
};
