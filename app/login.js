import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../hook/useAuth.js";
import { useRouter } from "expo-router";

export default function Login({ navigation }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    // Validation
    if (!userName.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const result = await login(userName.trim(), password);

    if (result.success) {
      Alert.alert("Success", "Login successful!");
      router.push("./dashboard");
    } else {
      Alert.alert("Login Failed", result.error || "Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        <Text className="text-4xl font-bold text-gray-800 mb-2">
          Welcome Back
        </Text>
        <Text className="text-base text-gray-600 mb-10">
          Login to your account
        </Text>

        <View className="mb-5">
          <TextInput
            className="bg-gray-100 rounded-xl p-4 text-base border border-gray-200"
            placeholder="Username"
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View className="mb-5">
          <TextInput
            className="bg-gray-100 rounded-xl p-4 text-base border border-gray-200"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {error && (
          <Text className="text-red-500 text-sm mb-3 text-center">{error}</Text>
        )}

        <TouchableOpacity
          className={`bg-blue-500 rounded-xl p-4 items-center mt-2 ${
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

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          className="mt-5 items-center"
        >
          <Text className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Text className="text-blue-500 font-semibold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
