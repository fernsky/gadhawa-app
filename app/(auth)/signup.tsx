import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "react-native-heroicons/outline";
import { useForm, Controller, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignup } from "@/lib/hooks/useAuth";
import { toast } from "@/lib/toast";
import { signupSchema, type SignupInput, AuthError } from "@/api/auth";
import Checkbox from "expo-checkbox";

export default function SignUp() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      agreeToTerms: false,
    },
  });

  const { mutate: signup, isPending } = useSignup({
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success(
        "Welcome aboard!",
        "Your account has been created successfully"
      );
      router.replace("/(app)"); // Updated path
    },
    onError: (error: AuthError) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      if (error.code === 409) {
        toast.error(
          "Account exists",
          "An account with this email already exists"
        );
      } else if (error.code === 400 && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (field in control._fields) {
            setError(field as keyof SignupInput, {
              type: "manual",
              message: messages[0],
            });
          }
        });
        toast.error("Validation Error", "Please check your input");
      } else {
        toast.error(
          "Oops!",
          error.message || "Something went wrong, please try again"
        );
      }
    },
  });

  const onSubmit = (data: SignupInput) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    signup(data);
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
        <View className="items-center mb-8">
          <View className="flex-row items-center bg-blue-50 self-center px-4 py-2 rounded-full mb-6">
            <SparklesIcon size={16} color="#3b82f6" />
            <Text
              style={{ fontFamily: "Inter_500Medium" }}
              className="text-blue-600 ml-2 text-sm"
            >
              Create Account
            </Text>
          </View>

          <Text
            style={{ fontFamily: "Inter_600SemiBold" }}
            className="text-2xl text-center text-slate-900"
          >
            Join Survey Management
          </Text>
        </View>

        <View className="space-y-4 grid gap-2 w-full max-w-sm self-center">
          {/* Form fields */}
          <FormField
            control={control}
            name="name"
            placeholder="Full Name"
            icon={<UserIcon size={20} color="#475569" />}
            error={errors.name?.message}
            editable={!isPending}
          />

          <FormField
            control={control}
            name="email"
            placeholder="Email Address"
            icon={<EnvelopeIcon size={20} color="#475569" />}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isPending}
          />

          <FormField
            control={control}
            name="password"
            placeholder="Password"
            icon={<KeyIcon size={20} color="#475569" />}
            error={errors.password?.message}
            secureTextEntry
            editable={!isPending}
          />

          <FormField
            control={control}
            name="confirmPassword"
            placeholder="Confirm Password"
            icon={<KeyIcon size={20} color="#475569" />}
            error={errors.confirmPassword?.message}
            secureTextEntry
            editable={!isPending}
          />

          <Controller
            control={control}
            name="agreeToTerms"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row items-start gap-2 mt-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                <View className="mt-0.5">
                  <Checkbox
                    value={value}
                    onValueChange={(newValue) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onChange(newValue);
                    }}
                    color={value ? "#2563eb" : undefined}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      borderWidth: 1.5,
                      borderColor: value ? "#2563eb" : "#94a3b8",
                    }}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    style={{ fontFamily: "Inter_500Medium" }}
                    className="text-sm text-slate-700 leading-5"
                  >
                    I agree to the{" "}
                    <Text
                      className="text-blue-600"
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        // Handle Terms of Service press
                      }}
                    >
                      Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text
                      className="text-blue-600"
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        // Handle Privacy Policy press
                      }}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
              </View>
            )}
          />
          {errors.agreeToTerms && (
            <Text
              style={{ fontFamily: "Inter_500Medium" }}
              className="text-red-500 text-xs ml-1 mt-1"
            >
              {errors.agreeToTerms.message}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className={`rounded-xl p-4 mt-6 ${
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
                  Create Account
                </Text>
                <ArrowRightIcon size={18} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <View className="flex-row justify-center items-center">
            <Text
              style={{ fontFamily: "Inter_400Regular" }}
              className="text-slate-500"
            >
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(auth)/signin");
              }}
            >
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className="text-blue-600 ml-1"
              >
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// FormField component for reusability
function FormField({
  control,
  name,
  icon,
  error,
  ...props
}: {
  control: Control<SignupInput>;
  name: Exclude<keyof SignupInput, "agreeToTerms">;
  icon: React.ReactNode;
  error?: string;
  [key: string]: any;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="space-y-2 mb-2 grid gap-2">
          {/* Added more vertical spacing */}
          <View
            className={`flex-row items-center bg-slate-50/80 rounded-xl p-4 border ${
              error ? "border-red-300" : "border-slate-200"
            }`}
          >
            {icon}
            <TextInput
              style={{
                fontFamily: "Inter_400Regular",
                color: error ? "#EF4444" : "#1F2937", // Red text for error state
              }}
              className="flex-1 ml-3 text-base"
              value={value}
              onChangeText={onChange}
              placeholderTextColor={error ? "#FCA5A5" : "#94A3B8"} // Red tinted placeholder for error
              {...props}
            />
          </View>
          {error && (
            <View className="flex-row items-center px-1">
              <Text
                style={{ fontFamily: "Inter_500Medium", color: "#EF4444" }} // Red text for error
                className="text-red-500 text-xs"
              >
                {error}
              </Text>
            </View>
          )}
        </View>
      )}
    />
  );
}
