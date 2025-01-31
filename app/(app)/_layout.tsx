import { Drawer } from "expo-router/drawer";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import colors from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SparklesIcon,
  HomeIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "react-native-heroicons/outline";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLogout } from "@/lib/hooks/useAuth";

const menuItems = [
  { name: "home", label: "Home", icon: HomeIcon },
  { name: "profile", label: "My Profile", icon: UserCircleIcon },
  { name: "surveys", label: "My Surveys", icon: ClipboardDocumentListIcon },
  { name: "settings", label: "Settings", icon: Cog6ToothIcon },
];

function MenuItem({
  icon: Icon,
  label,
  isFocused,
  onPress,
}: {
  icon: any;
  label: string;
  isFocused: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-4 py-3.5 mb-1 rounded-xl 
        ${isFocused ? "bg-blue-50" : "bg-transparent"}`}
      style={{
        transform: [{ scale: isFocused ? 1 : 0.98 }],
      }}
    >
      <View
        className={`w-9 h-9 rounded-full items-center justify-center
          ${isFocused ? "bg-blue-100" : "bg-slate-50"}`}
      >
        <Icon size={20} color={isFocused ? colors.primary : "#64748b"} />
      </View>
      <Text
        style={{
          fontFamily: isFocused ? "Inter_600SemiBold" : "Inter_500Medium",
        }}
        className={`ml-3 ${isFocused ? "text-blue-600" : "text-slate-600"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function CustomDrawerContent(props: any) {
  const { mutate: logout, isPending } = useLogout();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <LinearGradient
        colors={["#EFF6FF", "#ffffff"]}
        className="absolute inset-0"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header with Avatar */}
      <View className="px-6 py-8 border-b border-slate-100">
        <View className="flex-row items-center bg-blue-50 self-start px-4 py-2 rounded-full mb-6">
          <SparklesIcon size={16} color="#3b82f6" />
          <Text
            style={{ fontFamily: "Inter_600SemiBold" }}
            className="text-blue-600 ml-2 text-sm"
          >
            Survey Management
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center">
            <Text
              style={{ fontFamily: "Inter_600SemiBold" }}
              className="text-lg text-white"
            >
              JS
            </Text>
          </View>
          <View className="ml-3">
            <Text
              style={{ fontFamily: "Inter_700Bold" }}
              className="text-lg text-slate-900"
            >
              John Smith
            </Text>
            <Text
              style={{ fontFamily: "Inter_400Regular" }}
              className="text-sm text-slate-500"
            >
              Field Surveyor
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View className="flex-1 px-2 py-4">
        <Text
          style={{ fontFamily: "Inter_600SemiBold" }}
          className="text-xs uppercase tracking-wider text-slate-400 px-4 mb-2"
        >
          Main Menu
        </Text>
        {menuItems.map((item) => (
          <MenuItem
            key={item.name}
            icon={item.icon}
            label={item.label}
            isFocused={props.state.routeNames[props.state.index] === item.name}
            onPress={() => props.navigation.navigate(item.name)}
          />
        ))}
      </View>

      {/* Footer with Logout */}
      <View
        className="p-4 border-t border-slate-100"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <TouchableOpacity
          className="flex-row items-center px-4 py-3 rounded-xl"
          onPress={() => logout()}
          disabled={isPending}
        >
          <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center">
            <ArrowLeftOnRectangleIcon
              size={20}
              color={isPending ? "#FDA4AF" : "#EF4444"}
            />
          </View>
          <Text
            style={{ fontFamily: "Inter_600SemiBold" }}
            className={`ml-3 ${isPending ? "text-red-300" : "text-red-600"}`}
          >
            {isPending ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
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
