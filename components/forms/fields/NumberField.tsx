import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import { NumberFieldConfig, ValidationContext } from "@/types/forms";
import * as Haptics from "expo-haptics";
import { MinusIcon, PlusIcon } from "react-native-heroicons/outline";

interface NumberFieldProps extends NumberFieldConfig {
  name: string;
  validationContext: ValidationContext;
}

export default function NumberField({
  name,
  label,
  description,
  placeholder = "0",
  defaultValue,
  required,
  disabled,
  min,
  max,
  step = 1,
  unit,
  validationContext,
}: NumberFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  const handleFocus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const validateNumber = (value: string) => {
    const num = Number(value);
    if (isNaN(num)) return "Please enter a valid number";
    if (min !== undefined && num < min) return `Minimum value is ${min}`;
    if (max !== undefined && num > max) return `Maximum value is ${max}`;
    return true;
  };

  const handleIncrement = (
    value: string,
    onChange: (value: string) => void
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentValue = Number(value) || 0;
    const newValue = currentValue + step;
    if (max === undefined || newValue <= max) {
      onChange(String(newValue));
    }
  };

  const handleDecrement = (
    value: string,
    onChange: (value: string) => void
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentValue = Number(value) || 0;
    const newValue = currentValue - step;
    if (min === undefined || newValue >= min) {
      onChange(String(newValue));
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required && "This field is required",
        validate: validateNumber,
      }}
      defaultValue={defaultValue?.toString()}
      render={({ field: { onChange, onBlur, value } }) => (
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

          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={[
                styles.button,
                disabled && styles.buttonDisabled,
                (!value || (min !== undefined && Number(value) <= min)) &&
                  styles.buttonDisabled,
              ]}
              onPress={() => handleDecrement(value, onChange)}
              disabled={
                disabled ||
                !value ||
                (min !== undefined && Number(value) <= min)
              }
            >
              <MinusIcon size={16} color={disabled ? "#94A3B8" : "#3B82F6"} />
            </TouchableOpacity>

            <View
              style={[
                styles.inputContainer,
                error && styles.inputError,
                disabled && styles.inputDisabled,
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  error && styles.inputTextError,
                  disabled && styles.inputTextDisabled,
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                editable={!disabled}
                onFocus={handleFocus}
              />
              {unit && <Text style={styles.unit}>{unit}</Text>}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                disabled && styles.buttonDisabled,
                max !== undefined &&
                  Number(value) >= max &&
                  styles.buttonDisabled,
              ]}
              onPress={() => handleIncrement(value, onChange)}
              disabled={disabled || (max !== undefined && Number(value) >= max)}
            >
              <PlusIcon size={16} color={disabled ? "#94A3B8" : "#3B82F6"} />
            </TouchableOpacity>
          </View>

          {error && (
            <Text style={styles.errorText}>{error.message as string}</Text>
          )}

          {(min !== undefined || max !== undefined) && (
            <Text style={styles.rangeText}>
              {min !== undefined && max !== undefined
                ? `Value between ${min} and ${max}`
                : min !== undefined
                ? `Minimum value: ${min}`
                : `Maximum value: ${max}`}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  labelContainer: {
    marginBottom: 6,
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#F1F5F9",
    opacity: 0.5,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  inputDisabled: {
    borderColor: "#E2E8F0",
    backgroundColor: "#F1F5F9",
  },
  input: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#1F2937",
    minHeight: 46,
    textAlign: "center",
  },
  inputTextError: {
    color: "#EF4444",
  },
  inputTextDisabled: {
    color: "#94A3B8",
  },
  unit: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#64748B",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  rangeText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
});
