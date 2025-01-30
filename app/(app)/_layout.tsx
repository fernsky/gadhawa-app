import { Drawer } from "expo-router/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "@/constants/Colors";
import CustomDrawer from "@/components/CustomDrawer";

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerStyle: {
          backgroundColor: "#fff",
          width: 280,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: "#333",
        swipeEnabled: true,
        drawerType: "front",
        overlayColor: "rgba(0,0,0,0.5)",
      }}
    />
  );
}
