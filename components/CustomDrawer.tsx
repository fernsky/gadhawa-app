import { View, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Text, Avatar, Divider } from "react-native-paper";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import colors from "@/constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import useAuthStore from "@/store/auth";
import { useLogout } from "@/lib/hooks/useAuth";

interface MenuItemProps {
  icon: JSX.Element;
  label: string;
  onPress?: () => void;
  isLogout?: boolean;
  disabled?: boolean;
}

const MenuItem = ({ icon, label, onPress, isLogout }: MenuItemProps) => (
  <TouchableOpacity
    style={[styles.menuItem, isLogout && styles.logoutButton]}
    onPress={onPress}
  >
    {icon}
    <Text
      variant="bodyLarge"
      style={[styles.menuText, isLogout && styles.logoutText]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

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
      icon: (
        <MaterialCommunityIcons
          name="home-outline"
          size={24}
          color={colors.primary}
        />
      ),
      label: "Home",
      onPress: () => router.push("/(app)"),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="account-outline"
          size={24}
          color={colors.primary}
        />
      ),
      label: "Profile",
      onPress: () => router.push("/(app)/profile"),
    },
    {
      icon: (
        <Ionicons
          name="notifications-outline"
          size={24}
          color={colors.primary}
        />
      ),
      label: "Notifications",
      onPress: () => router.push("/(app)/notifications"),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="cog-outline"
          size={24}
          color={colors.primary}
        />
      ),
      label: "Settings",
      onPress: () => router.push("/(app)/settings"),
    },
  ];

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.profileSection}>
        <Avatar.Image
          size={80}
          source={require("@/assets/images/default-avatar.png")}
        />
        <View style={styles.profileInfo}>
          <Text variant="titleLarge" style={styles.name}>
            {user?.name || "Guest"}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {user?.email || "Not signed in"}
          </Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}

        <Divider style={styles.divider} />

        <MenuItem
          icon={
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={24}
              color={colors.primary}
            />
          }
          label="Help & Support"
          onPress={() => router.push("/(app)/help")}
        />

        <MenuItem
          icon={
            <MaterialCommunityIcons name="logout" size={24} color="#FF4444" />
          }
          label={isPending ? "Logging out..." : "Logout"}
          onPress={handleSignOut}
          isLogout
          disabled={isPending}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileSection: {
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 15,
  },
  name: {
    fontWeight: "bold",
    color: colors.primary,
  },
  email: {
    color: "#666",
    marginTop: 5,
  },
  divider: {
    marginVertical: 15,
    backgroundColor: "#eee",
    height: 1,
  },
  menuContainer: {
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  menuText: {
    marginLeft: 15,
    color: "#333",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#FFF1F1",
  },
  logoutText: {
    color: "#FF4444",
  },
});
