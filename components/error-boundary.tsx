import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Error caught in boundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center p-4">
          <Text
            style={{ fontFamily: "Inter_600SemiBold" }}
            className="text-xl text-slate-900 mb-2"
          >
            Something went wrong
          </Text>
          <Text
            style={{ fontFamily: "Inter_400Regular" }}
            className="text-base text-slate-600 mb-6 text-center"
          >
            We encountered an unexpected error.{"\n"}Please try again.
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.setState({ hasError: false });
              router.replace("/");
            }}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            <Text
              style={{ fontFamily: "Inter_500Medium" }}
              className="text-white"
            >
              Return Home
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
