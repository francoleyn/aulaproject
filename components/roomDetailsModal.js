import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEquipment } from "../hook/useEquipment";
import { useSchedule } from "../hook/useSchedule";

const RoomDetailsModal = ({ visible, onClose, room }) => {
  const {
    getRoomDetails,
    equipments,
    loading: equipmentLoading,
  } = useEquipment();
  const {
    getSchedulesByRoomAndDay,
    schedules,
    loading: scheduleLoading,
  } = useSchedule();

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (visible && room) {
      fetchRoomData();
    }
  }, [visible, room, selectedDate]);

  const fetchRoomData = async () => {
    try {
      // Get room equipments
      await getRoomDetails(room.id);

      // Get schedules for today - convert to day of week name
      const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
      const dayName = days[selectedDate.getDay()];
      await getSchedulesByRoomAndDay(room.id, dayName);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const getDayName = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    return days[selectedDate.getDay()];
  };

  const getDate = () => {
    return selectedDate.getDate();
  };

  if (!room) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" />
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-[#2A2E39] rounded-t-3xl h-[90%]">
          {/* Header */}
          <View className="items-center py-4 border-b border-gray-700">
            <View className="w-12 h-1 bg-gray-600 rounded-full mb-3" />
            <Text className="text-white text-xl font-semibold">
              Room Details
            </Text>
          </View>

          <ScrollView
            className="flex-1 px-6 py-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Room Info */}
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-1">
                <Text className="text-white text-4xl font-bold mb-3">
                  {room.roomnum || `Room ${room.id}`}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-400 text-base mb-1">
                  Capacity: {room.capacity}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {room.floornum} Floor
                </Text>
                <Text className="text-green-500 text-sm font-semibold mt-1">
                  {room.bldg} BLDG
                </Text>
              </View>
            </View>

            {/* Equipments Section */}
            <View className="mb-6">
              <Text className="text-white text-xl font-semibold mb-4">
                Equipments
              </Text>
              {equipmentLoading ? (
                <ActivityIndicator color="#10B981" size="small" />
              ) : equipments && equipments.length > 0 ? (
                <View className="flex-row flex-wrap gap-2">
                  {equipments.map((equipment, index) => (
                    <View
                      key={index}
                      className="bg-white px-4 py-2 rounded-full flex-row items-center"
                    >
                      <Text className="text-gray-800 font-medium">
                        {equipment.name}
                      </Text>
                      {equipment.quantity > 1 && (
                        <View className="bg-red-500 rounded-full w-5 h-5 items-center justify-center ml-1">
                          <Text className="text-white text-xs font-bold">
                            {equipment.quantity}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              ) : (
                <View className="bg-gray-700/50 rounded-xl p-4 items-center">
                  <Ionicons
                    name="construct-outline"
                    size={32}
                    color="#6B7280"
                  />
                  <Text className="text-gray-400 mt-2">
                    No equipment available
                  </Text>
                </View>
              )}
            </View>

            {/* Schedule Section */}
            <View className="mb-6">
              <Text className="text-white text-xl font-semibold mb-4">
                Schedule
              </Text>

              {scheduleLoading ? (
                <ActivityIndicator color="#10B981" size="small" />
              ) : (
                <View>
                  {/* Date Header */}
                  <View className="flex-row items-center mb-4">
                    <View className="bg-blue-500 w-16 h-16 rounded-2xl items-center justify-center mr-4">
                      <Text className="text-white text-xs font-semibold">
                        {getDayName()}
                      </Text>
                      <Text className="text-white text-2xl font-bold">
                        {getDate()}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-sm">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>

                  {/* Schedule List */}
                  {schedules && schedules.length > 0 ? (
                    schedules.map((schedule, index) => (
                      <View
                        key={index}
                        className="mb-4 bg-gray-700/50 rounded-xl p-4"
                      >
                        <View className="flex-row items-center mb-2">
                          <View
                            className={`w-2 h-2 rounded-full mr-3 ${
                              schedule.status === "scheduled"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <Text className="text-white text-lg font-semibold flex-1">
                            {schedule.userName}
                          </Text>
                        </View>
                        <View className="flex-row items-center ml-5">
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color="#9CA3AF"
                          />
                          <Text className="text-gray-400 ml-2">
                            {schedule.timeSlot ||
                              `${schedule.startTime} - ${schedule.endTime}`}
                          </Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View className="bg-gray-700/50 rounded-xl p-6 items-center">
                      <Ionicons
                        name="calendar-outline"
                        size={32}
                        color="#6B7280"
                      />
                      <Text className="text-gray-400 mt-2">
                        No schedules for this date
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Close Button */}
          <View className="px-6 py-4 border-t border-gray-700">
            <TouchableOpacity
              onPress={onClose}
              className="bg-blue-500 py-4 rounded-xl items-center flex-row justify-center"
            >
              <Ionicons name="close-circle-outline" size={24} color="#fff" />
              <Text className="text-white font-semibold text-base ml-2">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RoomDetailsModal;
