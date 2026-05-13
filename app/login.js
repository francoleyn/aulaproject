import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../hook/useAuth.js";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, continueAsStudent, loading, error } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!userName.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const result = await login(userName.trim(), password);

    if (result.success) {
      Alert.alert("Success", "Login successful!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } else {
      Alert.alert("Login Failed", result.error || "Invalid credentials");
    }
  };

  const handleContinueAsStudent = async () => {
    const result = await continueAsStudent();
    if (result.success) {
      router.replace("/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-[#071020] justify-center px-8">

     
        <View className="items-center mb-12">
          {/* AULA TITLE */}
          <Text
            className="font-extrabold mt-6"
            style={{
              fontSize: 58,
              color: "#60A5FA",
              textShadowColor: "rgba(0,0,0,0.5)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 4,
            }}
          >
            Aula
          </Text>
        </View>

        {/* LOGIN CARD */}
        <View className="bg-[#101b2d] p-8 rounded-3xl shadow-lg border border-[#1f2d40]">
          
          <Text className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </Text>

          <Text className="text-base text-gray-400 mb-8">
            Login to your account
          </Text>

          {/* USERNAME FIELD */}
          <View className="mb-6">
            <TextInput
              className="bg-[#1A2433] text-white rounded-xl p-4 text-base border border-[#2f4a69]"
              placeholder="Username"
              placeholderTextColor="#6B7280"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* PASSWORD FIELD */}
          <View className="mb-6 relative">
            <TextInput
              className="bg-[#1A2433] text-white rounded-xl p-4 text-base border border-[#2f4a69] pr-12"
              placeholder="Password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />

            {/* SHOW / HIDE TOGGLE  */}
            <TouchableOpacity
              className="absolute right-4 top-4"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text className="text-blue-400 font-semibold">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Show ERROR MESSAGE */}
          {error && (
            <Text className="text-red-400 text-sm mb-3 text-center">
              {error}
            </Text>
          )}

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            className={`bg-blue-600 rounded-xl p-4 items-center mt-2 ${
              loading ? "opacity-50" : ""
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold">Login</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* CONTINUE AS STUDENT */}
        <TouchableOpacity
          className="mt-6 py-4 items-center"
          onPress={handleContinueAsStudent}
          disabled={loading}
        >
          <Text className="text-gray-400 text-base">
            Continue as a <Text className="text-blue-400 font-semibold">Student</Text>
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            View available rooms only
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
