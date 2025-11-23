import { Tabs } from "expo-router";
import { House, CalendarClockIcon, Send } from "lucide-react-native";

export default function _layout() {
  const Tabicon = ({ focused, icon, size, color }) => {
    const IconComponent = icon;

    if (focused) {
      return <IconComponent size={size} color="#fff" />;
    }

    return <IconComponent size={size} color={color} />;
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
          title: "index",
          tabBarIcon: ({ focused, color, size }) => (
            <Tabicon
              focused={focused}
              icon={House}
              iconname="house"
              size={28}
              color="#111827"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: "request",
          tabBarIcon: ({ focused, color, size }) => (
            <Tabicon
              focused={focused}
              icon={CalendarClockIcon}
              iconname="calendar-clock"
              size={28}
              color="#111827"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reservation"
        options={{
          title: "reservation",
          tabBarIcon: ({ focused, color, size }) => (
            <Tabicon
              focused={focused}
              icon={Send}
              iconname="send"
              size={28}
              color="#111827"
            />
          ),
        }}
      />
    </Tabs>
  );
}
