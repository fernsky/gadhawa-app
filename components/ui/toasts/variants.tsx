import React from "react";
import { View } from "react-native";
import { BaseToast } from "react-native-toast-message";

export const toastVariants = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: "#F0FDF4",
        borderColor: "#BBF7D0",
        borderRadius: 12,
        borderWidth: 1,
        marginHorizontal: 16,
        minHeight: 64,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "Inter_600SemiBold",
        color: "#166534",
        lineHeight: 20,
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: "400",
        fontFamily: "Inter_400Regular",
        color: "#166534",
        lineHeight: 18,
        opacity: 0.9,
      }}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: "#FEF2F2",
        borderColor: "#FECACA",
        borderRadius: 12,
        borderWidth: 1,
        marginHorizontal: 16,
        minHeight: 64,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        fontSize: 13,
        fontWeight: "600",
        fontFamily: "Inter_600SemiBold",
        color: "#991B1B",
        lineHeight: 20,
      }}
      text2Style={{
        fontSize: 11,
        fontWeight: "400",
        fontFamily: "Inter_400Regular",
        color: "#991B1B",
        lineHeight: 18,
        opacity: 0.9,
      }}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: "#EFF6FF",
        borderColor: "#BFDBFE",
        borderRadius: 12,
        borderWidth: 1,
        marginHorizontal: 16,
        minHeight: 64,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "Inter_600SemiBold",
        color: "#1E40AF",
        lineHeight: 20,
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: "400",
        fontFamily: "Inter_400Regular",
        color: "#1E40AF",
        lineHeight: 18,
        opacity: 0.9,
      }}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
    />
  ),
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: "#FFFBEB",
        borderColor: "#FDE68A",
        borderRadius: 12,
        borderWidth: 1,
        marginHorizontal: 16,
        minHeight: 64,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "Inter_600SemiBold",
        color: "#92400E",
        lineHeight: 20,
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: "400",
        fontFamily: "Inter_400Regular",
        color: "#92400E",
        lineHeight: 18,
        opacity: 0.9,
      }}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
    />
  ),
};
