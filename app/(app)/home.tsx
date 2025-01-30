import React from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import { useUserProfile } from "@/lib/hooks/useUser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
} from "react-native-heroicons/outline";
import { format } from "date-fns";

const ProfileCard = ({ label, value, icon }: any) => (
  <View className="flex-row items-center space-x-4 bg-white/80 p-4 rounded-xl border border-slate-100">
    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
      {icon}
    </View>
    <View className="flex-1">
      <Text
        className="text-slate-500 text-sm"
        style={{ fontFamily: "Inter_500Medium" }}
      >
        {label}
      </Text>
      <Text
        className="text-slate-900 text-base"
        style={{ fontFamily: "Inter_600SemiBold" }}
      >
        {value}
      </Text>
    </View>
  </View>
);

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
    error,
  } = useUserProfile();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <LinearGradient
        colors={["#EFF6FF", "#ffffff"]}
        className="absolute inset-0"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative Elements */}
      <View className="absolute -left-24 top-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
      <View className="absolute -right-24 top-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#2563EB"
            colors={["#2563EB"]}
          />
        }
      >
        {/* Profile Section */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-blue-50 items-center justify-center mb-4">
            <Text
              style={{ fontFamily: "Inter_600SemiBold" }}
              className="text-2xl text-blue-600"
            >
              {profile?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>

          <Text
            style={{ fontFamily: "Inter_700Bold" }}
            className="text-2xl text-center text-slate-900"
          >
            {profile?.name}
          </Text>
          <Text
            style={{ fontFamily: "Inter_400Regular" }}
            className="text-slate-500 text-center mt-1"
          >
            {profile?.email}
          </Text>
        </View>

        {/* Profile Cards */}
        <View className="space-y-4">
          <Text
            style={{ fontFamily: "Inter_600SemiBold" }}
            className="text-sm text-slate-400 uppercase tracking-wider mb-2 px-1"
          >
            Account Information
          </Text>

          <ProfileCard
            label="Full Name"
            value={profile?.name}
            icon={<UserCircleIcon size={24} color="#3b82f6" />}
          />
          <ProfileCard
            label="Email Address"
            value={profile?.email}
            icon={<EnvelopeIcon size={24} color="#3b82f6" />}
          />
          <ProfileCard
            label="Member Since"
            value={
              profile?.createdAt
                ? format(new Date(profile.createdAt), "MMMM dd, yyyy")
                : "-"
            }
            icon={<CalendarDaysIcon size={24} color="#3b82f6" />}
          />
        </View>

        {/* Refresh Button */}
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-8 bg-blue-50 self-center px-4 py-2 rounded-full flex-row items-center"
        >
          <ArrowPathIcon size={16} color="#3b82f6" />
          <Text
            style={{ fontFamily: "Inter_500Medium" }}
            className="text-blue-600 ml-2"
          >
            Refresh Profile
          </Text>
        </TouchableOpacity>

        {isError && (
          <View className="mt-4 bg-red-50 p-4 rounded-xl">
            <Text
              style={{ fontFamily: "Inter_500Medium" }}
              className="text-red-600 text-center"
            >
              {error instanceof Error ? error.message : "Error loading profile"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
