import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (isLoggedIn && !inAuthGroup) {
      // User is logged in but not in tabs, redirect to tabs
      router.replace("/(tabs)");
    } else if (!isLoggedIn && inAuthGroup) {
      // User is not logged in but in tabs, redirect to login
      router.replace("/login");
    }
  }, [isReady, isLoggedIn, segments]);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      setIsLoggedIn(!!userData);
    } catch (error) {
      console.error("Error checking auth state:", error);
      setIsLoggedIn(false);
    } finally {
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
