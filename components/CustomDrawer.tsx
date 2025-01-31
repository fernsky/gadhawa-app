import "../global.css";
import { View } from "react-native";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Text } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import useAuthStore from "@/store/auth";
import { useLogout } from "@/lib/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SparklesIcon,
  HomeIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "react-native-heroicons/outline";

interface MenuItemProps {
  icon: JSX.Element;
  label: string;
  onPress?: () => void;
  isFocused?: boolean;
  isLogout?: boolean;
  disabled?: boolean;
}

const MenuItem = ({
  icon,
  label,
  onPress,
  isFocused,
  isLogout,
  disabled,
}: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={`flex-row items-center px-4 py-3.5 mb-1 rounded-xl
      ${isFocused ? "bg-blue-50" : "bg-transparent"}
      ${isLogout ? "mt-4 bg-red-50" : ""}
      ${disabled ? "opacity-50" : ""}`}
  >
    {icon}
    <Text
      className={`ml-3 ${
        isLogout
          ? "text-red-600"
          : isFocused
          ? "text-blue-600"
          : "text-slate-600"
      }`}
      style={{
        fontFamily: isFocused ? "Inter_600SemiBold" : "Inter_500Medium",
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export function CustomDrawer(props: DrawerContentComponentProps) {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();
  const insets = useSafeAreaInsets();

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  const menuItems = [
    { name: "index", label: "Home", icon: HomeIcon },
    { name: "profile", label: "My Profile", icon: UserCircleIcon },
    { name: "surveys", label: "My Surveys", icon: ClipboardDocumentListIcon },
    { name: "settings", label: "Settings", icon: Cog6ToothIcon },
  ];

  return (
    <DrawerContentScrollView {...props} className="flex-1">
      <LinearGradient
        colors={["#EFF6FF", "#ffffff"]}
        className="absolute inset-0"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="px-6 py-8 border-b border-slate-100">
          <View className="flex-row items-center bg-blue-50 self-start px-4 py-2 rounded-full mb-6">
            <SparklesIcon size={16} color="#3b82f6" />
            <Text
              className="text-blue-600 ml-2 text-sm"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Survey Management
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center">
              <Text
                className="text-lg text-white"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                {userInitials}
              </Text>
            </View>
            <View className="ml-3">
              <Text
                className="text-lg text-slate-900"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                {user?.name || "Guest User"}
              </Text>
              <Text
                className="text-sm text-slate-500"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                {user?.email || "Not signed in"}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View className="flex-1 px-2 py-4">
          {menuItems.map((item) => (
            <MenuItem
              key={item.name}
              icon={
                <item.icon
                  size={20}
                  color={
                    props.state.routeNames[props.state.index] === item.name
                      ? "#3b82f6"
                      : "#64748b"
                  }
                />
              }
              label={item.label}
              isFocused={
                props.state.routeNames[props.state.index] === item.name
              }
              onPress={() => props.navigation.navigate(item.name)}
            />
          ))}

          {/* Logout Button */}
          <MenuItem
            icon={<ArrowLeftOnRectangleIcon size={20} color="#EF4444" />}
            label={isPending ? "Signing out..." : "Sign out"}
            onPress={() => logout()}
            isLogout
            disabled={isPending}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}
