import { View } from "react-native";

const SafeScreen = ({ children }) => {
  return <View className="pt-2 flex-1">{children}</View>;
};

export default SafeScreen;
