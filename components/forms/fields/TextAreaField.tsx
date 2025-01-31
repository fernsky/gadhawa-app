import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import * as Haptics from "expo-haptics";
import { TextFieldConfig, ValidationContext } from "@/types/forms";

interface TextAreaFieldProps extends Omit<TextFieldConfig, "type"> {
  name: string;
  validationContext: ValidationContext;
  rows?: number;
  autoGrow?: boolean;
  maxHeight?: number;
}

export default function TextAreaField({
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  rows = 4,
  autoGrow = true,
  maxHeight = 200,
  maxLength,
  minLength,
  validationContext,
}: TextAreaFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  const handleFocus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required && "This field is required",
        minLength: minLength && {
          value: minLength,
          message: `Minimum ${minLength} characters required`,
        },
        maxLength: maxLength && {
          value: maxLength,
          message: `Maximum ${maxLength} characters allowed`,
        },
      }}
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
                { height: Math.min(rows * 24, maxHeight) },
                error && styles.inputTextError,
                disabled && styles.inputTextDisabled,
              ]}
              multiline
              numberOfLines={rows}
              placeholder={placeholder}
              placeholderTextColor="#94A3B8"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              editable={!disabled}
              maxLength={maxLength}
              onFocus={handleFocus}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.footer}>
            {error && (
              <Text style={styles.errorText}>{error.message as string}</Text>
            )}
            {maxLength && (
              <Text style={styles.characterCount}>
                {value?.length || 0}/{maxLength}
              </Text>
            )}
          </View>
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
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
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
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#1F2937",
    padding: 12,
    textAlignVertical: "top",
  },
  inputTextError: {
    color: "#EF4444",
  },
  inputTextDisabled: {
    color: "#94A3B8",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    marginLeft: 4,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    marginLeft: 8,
  },
});
