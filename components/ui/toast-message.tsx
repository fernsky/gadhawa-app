import React from "react";
import { View, TouchableOpacity, Text as RNText } from "react-native";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";

type ToastProps = {
  text1?: string;
  text2?: string;
  type?: "success" | "error" | "info" | "warning";
  hide?: () => void;
};

const getToastConfig = (type: string) => {
  switch (type) {
    case "success":
      return {
        icon: CheckCircleIcon,
        backgroundColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "#059669", // Changed to direct color instead of Tailwind class
        iconColor: "#059669",
      };
    case "error":
      return {
        icon: XCircleIcon,
        backgroundColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "#DC2626",
        iconColor: "#DC2626",
      };
    case "info":
      return {
        icon: InformationCircleIcon,
        backgroundColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "#2563EB",
        iconColor: "#2563EB",
      };
    case "warning":
      return {
        icon: ExclamationTriangleIcon,
        backgroundColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "#D97706",
        iconColor: "#D97706",
      };
    default:
      return getToastConfig("info");
  }
};

export const BaseToast = ({
  text1,
  text2,
  type = "success",
  hide,
  ...props
}: ToastProps) => {
  const config = getToastConfig(type);
  const Icon = config.icon;
  console.log(props);
  return (
    <View
      className={`${config.backgroundColor} border ${config.borderColor} rounded-2xl mx-4 my-1`}
      style={{
        shadowColor: config.iconColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center p-4">
        <Icon size={24} color={config.iconColor} />
        <View className="flex-1 ml-3">
          {text1 && (
            <RNText
              style={{
                fontFamily: "Inter_600SemiBold",
                color: config.textColor,
                fontSize: 16,
                marginBottom: 2,
              }}
            >
              {text1}
            </RNText>
          )}
          {text2 && (
            <RNText
              style={{
                fontFamily: "Inter_400Regular",
                color: config.textColor,
                fontSize: 14,
                opacity: 0.9,
              }}
            >
              {text2}
            </RNText>
          )}
        </View>
        <TouchableOpacity
          onPress={hide}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="ml-3"
        >
          <XMarkIcon size={20} color={config.iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
