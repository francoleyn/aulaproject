import { useEffect, useState, useCallback } from "react";
import { Stack, useRouter, useSegments, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash screen may already be hidden
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

  const hideSplash = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
    } catch (e) {
      // Splash screen may already be hidden
    }
  }, []);

  const checkAuthState = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      setIsLoggedIn(!!userData);
      return !!userData;
    } catch (error) {
      console.error("Error checking auth state:", error);
      setIsLoggedIn(false);
      return false;
    }
  }, []);

  // Initial auth check on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      await checkAuthState();
      if (isMounted) {
        setIsReady(true);
      }
      hideSplash();
    };

    initAuth();

    // Fallback: Force hide splash screen after 3 seconds
    const timeout = setTimeout(() => {
      if (isMounted && !isReady) {
        setIsReady(true);
      }
      hideSplash();
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  // Re-check auth whenever pathname changes (navigation occurs)
  useEffect(() => {
    if (isReady) {
      checkAuthState();
    }
  }, [pathname, isReady]);

  // Handle redirects based on auth state
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(tabs)";

    // Only redirect if NOT logged in and trying to access tabs
    // Don't redirect away from tabs if logged in (let login handle navigation)
    if (!isLoggedIn && inAuthGroup) {
      router.replace("/login");
    }
  }, [isReady, isLoggedIn, segments]);

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
