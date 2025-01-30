import { Alert, Platform } from "react-native";
import Toast from "react-native-toast-message";

export const toast = {
  success: (message: string) => {
    if (Platform.OS === "web") {
      // Handle web toast
      return;
    }

    Toast.show({
      type: "success",
      text1: message,
      position: "top",
    });
  },
  error: (message: string) => {
    if (Platform.OS === "web") {
      // Handle web toast
      return;
    }

    Toast.show({
      type: "error",
      text1: message,
      position: "top",
    });
  },
};
