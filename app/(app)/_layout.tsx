import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomDrawer from "@/components/CustomDrawer";

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: "white",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(241, 245, 249, 1)",
          },
          headerTintColor: "#0F172A",
          headerTitleStyle: {
            fontFamily: "Inter_600SemiBold",
            fontSize: 16,
          },
          headerShadowVisible: false,
          drawerStyle: {
            backgroundColor: "transparent",
            width: 320,
          },
          sceneContainerStyle: {
            backgroundColor: "white",
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Home",
            headerTitle: "",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
