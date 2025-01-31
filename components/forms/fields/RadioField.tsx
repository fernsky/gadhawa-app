import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import * as Haptics from "expo-haptics";
import { SelectFieldConfig, ValidationContext } from "@/types/forms";

interface RadioFieldProps extends Omit<SelectFieldConfig, "type"> {
  name: string;
  validationContext: ValidationContext;
  layout?: "vertical" | "horizontal";
}

export default function RadioField({
  name,
  label,
  description,
  options = [],
  required,
  disabled,
  layout = "vertical",
  validationContext,
}: RadioFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  const handleSelect = (
    onChange: (value: string) => void,
    value: string | number
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(String(value));
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required && "This field is required" }}
      render={({ field: { value, onChange } }) => (
        <View style={styles.container}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>

          <View
            style={[
              styles.optionsContainer,
              layout === "horizontal" && styles.optionsHorizontal,
            ]}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  layout === "horizontal" && styles.optionHorizontal,
                  option.disabled && styles.optionDisabled,
                ]}
                onPress={() =>
                  !disabled &&
                  !option.disabled &&
                  handleSelect(onChange, option.value)
                }
                disabled={disabled || option.disabled}
              >
                <View
                  style={[
                    styles.radio,
                    value === option.value && styles.radioSelected,
                    (disabled || option.disabled) && styles.radioDisabled,
                    error && styles.radioError,
                  ]}
                >
                  {value === option.value && <View style={styles.radioInner} />}
                </View>
                <Text
                  style={[
                    styles.optionLabel,
                    (disabled || option.disabled) && styles.optionLabelDisabled,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error && (
            <Text style={styles.errorText}>{error.message as string}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#1F2937",
  },
  required: {
    color: "#EF4444",
  },
  description: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    marginTop: 2,
  },
  optionsContainer: {
    gap: 12,
  },
  optionsHorizontal: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionHorizontal: {
    minWidth: 120,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#3B82F6",
  },
  radioDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  radioError: {
    borderColor: "#FCA5A5",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
  },
  optionLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#1F2937",
  },
  optionLabelDisabled: {
    color: "#94A3B8",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
});
