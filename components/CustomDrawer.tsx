import { View, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import useAuthStore from "@/store/auth";
import { useLogout } from "@/lib/hooks/useAuth";
import {
  ArrowLeftOnRectangleIcon,
  SparklesIcon,
  HomeIcon,
  UserCircleIcon,
  BellIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MenuItemProps {
  icon: JSX.Element;
  label: string;
  onPress?: () => void;
  isLogout?: boolean;
  disabled?: boolean;
}

const MenuItem = ({
  icon,
  label,
  onPress,
  isLogout,
  disabled,
}: MenuItemProps) => (
  <TouchableOpacity
    style={[styles.menuItem, isLogout && styles.menuItemLogout]}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={[styles.menuIcon, isLogout && styles.menuIconLogout]}>
      {icon}
    </View>
    <Text style={[styles.menuText, isLogout && styles.menuTextLogout]}>
      {label}
    </Text>
    {!isLogout && <ChevronRightIcon size={14} color="#94A3B8" />}
  </TouchableOpacity>
);

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();
  const insets = useSafeAreaInsets();

  // Get user initials for avatar
  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace("/(auth)/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    {
      icon: <HomeIcon size={16} color="#3B82F6" />,
      label: "Home",
      onPress: () => router.push("/(app)"),
    },
    {
      icon: <UserCircleIcon size={16} color="#3B82F6" />,
      label: "Survey",
      onPress: () => router.push("/(app)/survey"),
    },
    {
      icon: <BellIcon size={16} color="#3B82F6" />,
      label: "Notifications",
      onPress: () => router.push("/(app)/notifications"),
    },
    {
      icon: <Cog6ToothIcon size={16} color="#3B82F6" />,
      label: "Settings",
      onPress: () => router.push("/(app)/settings"),
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#EFF6FF", "#ffffff"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative blur elements */}
      <View style={styles.blurCircle1} />
      <View style={styles.blurCircle2} />

      <DrawerContentScrollView {...props} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <SparklesIcon size={16} color="#3B82F6" />
            <Text style={styles.badgeText}>Survey Management</Text>
          </View>

          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitials}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
              <Text style={styles.userEmail}>
                {user?.email || "Not signed in"}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}

          <View style={styles.divider} />

          <MenuItem
            icon={<QuestionMarkCircleIcon size={20} color="#3B82F6" />}
            label="Help & Support"
            onPress={() => router.push("/(app)/help")}
          />
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleSignOut}
          disabled={isPending}
        >
          <View style={styles.logoutIcon}>
            <ArrowLeftOnRectangleIcon
              size={20}
              color={isPending ? "#FDA4AF" : "#EF4444"}
            />
          </View>
          <Text
            style={[styles.logoutText, isPending && styles.logoutTextDisabled]}
          >
            {isPending ? "Signing out..." : "Sign out"}
          </Text>
          <ChevronRightIcon
            size={16}
            color={isPending ? "#FDA4AF" : "#EF4444"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  blurCircle1: {
    position: "absolute",
    left: -96,
    top: 0,
    height: 192,
    width: 192,
    borderRadius: 96,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    transform: [{ scale: 1.2 }],
  },
  blurCircle2: {
    position: "absolute",
    right: -96,
    top: "25%",
    height: 256,
    width: 256,
    borderRadius: 128,
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    transform: [{ scale: 1.2 }],
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  badgeText: {
    marginLeft: 6,
    color: "#3B82F6",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 15,
    color: "#0F172A",
    fontFamily: "Inter_600SemiBold",
  },
  userEmail: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
  },
  menuContainer: {
    padding: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 2,
  },
  menuItemLogout: {
    backgroundColor: "#FEE2E2",
  },
  menuIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconLogout: {
    backgroundColor: "#FEE2E2",
  },
  menuText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#1F2937",
    fontFamily: "Inter_500Medium",
  },
  menuTextLogout: {
    color: "#EF4444",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
    marginHorizontal: 6,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  logoutIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#EF4444",
    fontFamily: "Inter_500Medium",
  },
  logoutTextDisabled: {
    color: "#FDA4AF",
  },
});
