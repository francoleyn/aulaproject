import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../hook/useAuth.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LucideArrowLeftCircle,
  LogOut,
  CircleUserIcon,
} from "lucide-react-native";

export default function Profile() {
  const router = useRouter();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#1a1a1a] justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 mt-9">
      {/* Header */}
      <View className="px-6 pt-9 pb-6">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            className="w-14 h-14 bg-gray-800 rounded-full items-center justify-center"
            onPress={() => router.back()}
          >
            <LucideArrowLeftCircle size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Avatar */}
      <View className="items-center mt-8 mb-12">
        <View className=" items-center justify-center">
          <CircleUserIcon size={70} color="#fff" />
        </View>

        {user && (
          <View className="mt-5 items-center">
            <Text className="text-white text-xl font-semibold">
              {user.firstname + " " + user.lastname || "User"}
            </Text>
            {user.email && (
              <Text className="text-gray-400 text-sm mt-1">{user.email}</Text>
            )}
          </View>
        )}
      </View>

      {/* Logout Button */}
      <View className="px-6">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-gray-800  rounded-xl p-4 flex-row items-center"
          activeOpacity={0.7}
        >
          <View className="w-10 h-10 justify-center ml-2">
            <LogOut size={24} color="#fff" />
          </View>
          <Text className="text-white text-base font-medium ml-2">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
