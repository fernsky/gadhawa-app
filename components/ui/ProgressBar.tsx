import React, { useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Text } from "react-native-paper";

interface ProgressBarProps {
  progress: number; // Value between 0 and 1
  showPercentage?: boolean;
  height?: number;
  animated?: boolean;
  color?: string;
  backgroundColor?: string;
}

export default function ProgressBar({
  progress,
  showPercentage = true,
  height = 4,
  animated = true,
  color = "#3B82F6",
  backgroundColor = "#E2E8F0",
}: ProgressBarProps) {
  const animatedWidth = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.spring(animatedWidth, {
        toValue: progress,
        useNativeDriver: false,
        friction: 8,
        tension: 20,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [progress, animated]);

  const percentage = Math.round(progress * 100);

  const width = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.progressContainer, { height }, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width,
              backgroundColor: color,
            },
          ]}
        >
          <View style={styles.glowEffect} />
        </Animated.View>
      </View>

      {showPercentage && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color }]}>{percentage}% Complete</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  progressContainer: {
    width: "100%",
    borderRadius: 100,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 100,
    position: "relative",
    overflow: "hidden",
  },
  glowEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  labelContainer: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
});
