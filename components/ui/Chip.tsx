import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import * as Haptics from "expo-haptics";

interface ChipProps {
  label: string;
  onRemove?: () => void;
  color?: string;
  backgroundColor?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  small?: boolean;
}

export function Chip({
  label,
  onRemove,
  color = "#3B82F6",
  backgroundColor = "#EFF6FF",
  icon,
  disabled,
  small,
}: ChipProps) {
  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRemove?.();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        small && styles.containerSmall,
        disabled && styles.containerDisabled,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      <Text
        style={[
          styles.label,
          { color },
          small && styles.labelSmall,
          disabled && styles.labelDisabled,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {onRemove && !disabled && (
        <TouchableOpacity
          onPress={handleRemove}
          style={[styles.removeButton, small && styles.removeButtonSmall]}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <XMarkIcon
            size={small ? 12 : 14}
            color={disabled ? "#94A3B8" : color}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  containerSmall: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: 4,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  labelSmall: {
    fontSize: 12,
  },
  labelDisabled: {
    color: "#94A3B8",
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  removeButtonSmall: {
    padding: 1,
    borderRadius: 8,
  },
});
