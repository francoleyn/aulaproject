import { Tabs } from "expo-router";
import { House, CalendarClockIcon, Send, Bell } from "lucide-react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function _layout() {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    checkGuestStatus();
  }, []);

  const checkGuestStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setIsGuest(user.isGuest === true);
      }
    } catch (error) {
      console.error("Error checking guest status:", error);
    }
  };

  const Tabicon = ({ focused, icon, size, color }) => {
    const IconComponent = icon;

    return (
      <IconComponent
        size={size}
        color={focused ? "#fff" : color}
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#aaa",
        tabBarStyle: {
          backgroundColor: "#1f2937",
        },
        tabBarItemStyle: {
          margin: 5,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Tabicon
              focused={focused}
              icon={House}
              size={28}
              color="#111827"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: "Request",
          href: isGuest ? null : "/request",
          tabBarIcon: ({ focused, color, size }) => (
            <Tabicon
              focused={focused}
              icon={CalendarClockIcon}
              size={28}
              color="#111827"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reservation"
        options={{
          title: "Reservation",
          href: isGuest ? null : "/reservation",
          tabBarIcon: ({ focused, color, size }) => (
            <Tabicon
              focused={focused}
              icon={Send}
              size={28}
              color="#111827"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          href: isGuest ? null : "/notifications",
          tabBarIcon: ({ focused, color, size }) => (
            <Tabicon
              focused={focused}
              icon={Bell}
              size={28}
              color="#111827"
            />
          ),
        }}
      />
    </Tabs>
  );
}