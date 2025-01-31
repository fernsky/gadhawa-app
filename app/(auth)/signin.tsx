import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  EnvelopeIcon,
  KeyIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "react-native-heroicons/outline";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignin } from "@/lib/hooks/useAuth";
import { toast } from "@/lib/toast";
import { signinSchema, type SigninInput, type AuthError } from "@/lib/api/auth";
import { useFormStore } from "@/store/form/store";
import SyncManager from "@/lib/sync/syncManager";

export default function SignIn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { db } = useFormStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signin, isPending } = useSignin({
    onSuccess: async () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success("Welcome back!", "Successfully logged in");
      router.replace("/(app)"); // This will now go to index.tsx in (app)
      if (db) {
        const syncManager = new SyncManager(db);
        await syncManager.syncAll();
      }
    },
    onError: (error: AuthError) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (error.code === 401) {
        toast.error("Login failed", "Invalid email or password");
      } else {
        toast.error(
          "Login failed",
          error.message || "Something went wrong, please try again"
        );
      }
    },
  });

  const onSubmit = (data: SigninInput) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    signin(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      <LinearGradient
        colors={["#fafafa", "#ffffff"]}
        className="absolute inset-0"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative Elements */}
      <View className="absolute -left-24 top-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
      <View className="absolute -right-24 top-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-12">
          {/* Welcome Badge */}
          <View className="flex-row items-center bg-blue-50 self-center px-4 py-2 rounded-full mb-8">
            <SparklesIcon size={16} color="#3b82f6" />
            <Text
              style={{ fontFamily: "Inter_500Medium" }}
              className="text-blue-600 ml-2 text-sm"
            >
              Survey Management System
            </Text>
          </View>

          <View className="space-y-3">
            <Text
              style={{ fontFamily: "Inter_300Light" }}
              className="text-3xl text-center text-slate-600 tracking-tight"
            >
              Welcome Back To
            </Text>
            <Text
              style={{ fontFamily: "Inter_700Bold" }}
              className="text-4xl text-center text-slate-900 tracking-tight"
            >
              Survey Management
            </Text>
            <Text
              style={{ fontFamily: "Inter_200ExtraLight" }}
              className="text-lg text-center text-slate-500"
            >
              Access your field data collection portal
            </Text>
          </View>
        </View>

        <View className="space-y-6 grid gap-2 w-full max-w-sm self-center">
          <View className="space-y-2">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View className="space-y-2">
                  <View
                    className={`flex-row items-center bg-slate-50/80 rounded-xl p-4 border ${
                      errors.email ? "border-red-300" : "border-slate-200"
                    }`}
                  >
                    <EnvelopeIcon size={20} color="#475569" />
                    <TextInput
                      style={{
                        fontFamily: "Inter_400Regular",
                        color: errors.email ? "#EF4444" : "#1F2937",
                      }}
                      className="flex-1 ml-3 text-base"
                      placeholder="Enter your email"
                      placeholderTextColor={
                        errors.email ? "#FCA5A5" : "#94A3B8"
                      }
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      editable={!isPending}
                    />
                  </View>
                  {errors.email && (
                    <Text
                      style={{ fontFamily: "Inter_500Medium" }}
                      className="text-red-500 text-xs ml-1"
                    >
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <View className="space-y-2">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View className="space-y-2">
                  <View
                    className={`flex-row items-center bg-slate-50/80 rounded-xl p-4 border ${
                      errors.password ? "border-red-300" : "border-slate-200"
                    }`}
                  >
                    <KeyIcon size={20} color="#475569" />
                    <TextInput
                      style={{
                        fontFamily: "Inter_400Regular",
                        color: errors.password ? "#EF4444" : "#1F2937",
                      }}
                      className="flex-1 ml-3 text-base"
                      placeholder="Enter your password"
                      placeholderTextColor={
                        errors.password ? "#FCA5A5" : "#94A3B8"
                      }
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                      editable={!isPending}
                    />
                  </View>
                  {errors.password && (
                    <Text
                      style={{ fontFamily: "Inter_500Medium" }}
                      className="text-red-500 text-xs ml-1"
                    >
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className={`rounded-xl p-4 mt-4 ${
              isPending ? "bg-blue-400" : "bg-blue-600"
            }`}
            style={{
              shadowColor: "#1e40af",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center justify-center">
                <Text
                  style={{ fontFamily: "Inter_600SemiBold", color: "white" }}
                  className="text-white text-base mr-2"
                >
                  Sign In
                </Text>
                <ArrowRightIcon size={18} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <TouchableOpacity
            className="self-center mb-2 py-2"
            onPress={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          >
            <Text
              style={{ fontFamily: "Inter_500Medium" }}
              className="text-blue-600"
            >
              Forgot password?
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
            <Text
              style={{ fontFamily: "Inter_400Regular" }}
              className="text-slate-500"
            >
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(auth)/signup");
              }}
            >
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className="text-blue-600 ml-1"
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
