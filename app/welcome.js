import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";

const WelcomeScreen = ({ navigation }) => {
  const router = useRouter();
  const handleContinue = () => {
    router.push("/login");
  };

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <View className="flex-1 px-5 pt-10">
        {/* Header */}
        <Text className="text-gray-500 text-base mb-16">
          Login/Authentication
        </Text>

        {/* Logo Section */}
        <View className="items-start mb-20">
          <View className="flex-row items-center">
            {/* Logo Icon */}
            <View className="w-14 h-14 bg-white rounded-lg justify-center items-center mr-3 relative">
              <Text className="text-[#1a1a1a] text-3xl font-bold">A</Text>
              <View className="absolute top-2 right-2 w-3 h-3 bg-[#1a1a1a] rounded-full" />
            </View>

            {/* Logo Text */}
            <View>
              <Text className="text-white text-4xl font-bold tracking-wider">
                AULA
              </Text>
              <Text className="text-gray-400 text-sm -mt-1">
                USTP RoomSched
              </Text>
            </View>
          </View>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Continue Button */}
        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={handleContinue}
            className="flex-row items-center bg-red-500 rounded-full px-6 py-3"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold mr-2">
              Continue
            </Text>
            <View className="w-6 h-6 bg-white rounded-full justify-center items-center">
              <Text className="text-red-500 text-lg font-bold">→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Card Preview */}
        <View className="bg-gray-100 rounded-t-[30px] h-32 p-6">
          <View className="w-24 h-1.5 bg-gray-300 rounded-full self-center" />
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
