import { Tabs } from "expo-router";
import { House, CalendarClockIcon, Send, Bell } from "lucide-react-native";

export default function _layout() {
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