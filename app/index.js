import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function index() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-x1 font-bold text-blue-500">
        Welcome to Nativewind! hello
        <Link href="/login" className="text-red-500">
          {" "}
          Go to Login{" "}
        </Link>
        <Link href="/welcome" className="text-green-500">
          {" "}
          Go to Welcome{" "}
        </Link>
      </Text>
    </View>
  );
}
