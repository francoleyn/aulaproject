import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useUser from "../hook/useUser.js"; // ✅ custom hook for login

const LoginScreen = () => {
  const navigation = useNavigation();
  const { user, login, loading, error } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    const result = await login(username, password);

    if (result?.success) {
      Alert.alert("Success", "Login successful!", [
        { text: "OK", onPress: () => navigation.replace("Home") },
      ]);
    } else {
      Alert.alert("Login Failed", result?.error || "Invalid credentials");
    }
  };

  return (
    <View className="flex-1 bg-neutral-900">
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-5 pt-10">
          {/* Header */}
          <Text className="text-base text-gray-400 mb-16">
            Login / Authentication
          </Text>

          {/* Logo */}
          <View className="flex-row items-center mb-20">
            <View className="w-12 h-12 bg-white rounded-lg justify-center items-center mr-3">
              <Text className="text-2xl font-bold text-neutral-900">A</Text>
            </View>
            <View>
              <Text className="text-3xl font-bold text-white tracking-wider">
                AULA
              </Text>
              <Text className="text-sm text-gray-400 -mt-1">
                USTP RoomSched
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View className="flex-1 bg-gray-100 rounded-t-3xl p-6 pt-5">
            <View className="w-24 h-1.5 bg-gray-300 rounded-full self-center mb-7" />

            {/* Username */}
            <TextInput
              className="bg-gray-200 rounded-xl px-5 py-4 text-base text-gray-800 mb-4"
              placeholder="Username"
              placeholderTextColor="#6b7280"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            {/* Password */}
            <View className="mb-4 relative">
              <TextInput
                className="bg-gray-200 rounded-xl px-5 py-4 text-base text-gray-800"
                placeholder="Password"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text className="text-xl">{showPassword ? "👁️" : "🙈"}</Text>
              </TouchableOpacity>
            </View>

            {/* Options */}
            <View className="flex-row justify-between items-center mb-6 mt-2">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  className={`w-5 h-5 rounded border-2 mr-2 justify-center items-center ${
                    rememberMe
                      ? "bg-gray-500 border-gray-500"
                      : "border-gray-400"
                  }`}
                >
                  {rememberMe && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </View>
                <Text className="text-sm text-gray-600">Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text className="text-sm text-red-500 font-medium">
                  Forgot Password
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              disabled={loading}
              className={`rounded-xl py-4 items-center mb-6 ${
                loading ? "bg-gray-400" : "bg-red-500"
              }`}
              onPress={handleLogin}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-semibold tracking-wider">
                  LOGIN
                </Text>
              )}
            </TouchableOpacity>

            {/* Error */}
            {error && (
              <Text className="text-red-600 text-center mb-3">{error}</Text>
            )}

            {/* Sign Up */}
            <View className="flex-row justify-center items-center">
              <Text className="text-sm text-gray-500">
                Don't have an Account?{" "}
              </Text>
              <TouchableOpacity>
                <Text className="text-sm text-red-500 font-semibold">
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
