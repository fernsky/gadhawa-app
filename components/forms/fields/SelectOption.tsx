import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SelectOption as SelectOptionType } from "@/types/forms";
import { CheckIcon } from "react-native-heroicons/outline";

interface SelectOptionProps {
  option: SelectOptionType;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function SelectOption({
  option,
  isSelected,
  onSelect,
  disabled,
}: SelectOptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        isSelected && styles.optionSelected,
        disabled && styles.optionDisabled,
      ]}
      onPress={onSelect}
      disabled={disabled}
    >
      <Text
        style={[
          styles.optionText,
          isSelected && styles.optionTextSelected,
          disabled && styles.optionTextDisabled,
        ]}
      >
        {option.label}
      </Text>
      {isSelected && <CheckIcon size={20} color="#3B82F6" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  optionSelected: {
    backgroundColor: "#EFF6FF",
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#1F2937",
  },
  optionTextSelected: {
    color: "#3B82F6",
    fontFamily: "Inter_500Medium",
  },
  optionTextDisabled: {
    color: "#94A3B8",
  },
});
