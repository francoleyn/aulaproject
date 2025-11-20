import { Tabs } from "expo-router";
import { House, CalendarClockIcon, Send } from "lucide-react-native";

export default function _layout() {
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
          title: "index",
          tabBarIcon: ({ color, size }) => <House size={28} color="#fff" />,
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: "request",
          tabBarIcon: ({ color, size }) => (
            <CalendarClockIcon size={28} color="#fff" />
          ),
        }}
      />

      <Tabs.Screen
        name="reservation"
        options={{
          title: "reservation",
          tabBarIcon: ({ color, size }) => <Send size={28} color="#fff" />,
        }}
      />
    </Tabs>
  );
}
