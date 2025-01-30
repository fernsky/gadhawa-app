import { View, Animated, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import React, { useEffect, useRef } from "react";

type ToastProps = {
  type?: "success" | "error";
  message: string;
  onHide: () => void;
};

export function Toast({ type = "success", message, onHide }: ToastProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const Icon = type === "success" ? CheckCircleIcon : XCircleIcon;
  const bgColor = type === "success" ? "bg-emerald-50" : "bg-red-50";
  const borderColor =
    type === "success" ? "border-emerald-200" : "border-red-200";
  const textColor = type === "success" ? "text-emerald-800" : "text-red-800";
  const iconColor = type === "success" ? "#059669" : "#DC2626";

  return (
    <Animated.View
      className={`absolute top-12 mx-4 left-0 right-0 ${bgColor} border ${borderColor} rounded-2xl shadow-lg z-50`}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
        shadowColor: type === "success" ? "#065F46" : "#991B1B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      <View className="flex-row items-center p-4">
        <Icon size={24} color={iconColor} />
        <Text
          style={{ fontFamily: "Inter_500Medium" }}
          className={`flex-1 ml-3 ${textColor}`}
        >
          {message}
        </Text>
        <TouchableOpacity onPress={onHide}>
          <XMarkIcon size={20} color={iconColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
