import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import { TextFieldConfig, ValidationContext } from "@/types/forms";
import * as Haptics from "expo-haptics";

interface TextFieldProps extends TextFieldConfig {
  name: string;
  validationContext: ValidationContext;
}

export default function TextField({
  name,
  label,
  description,
  placeholder,
  defaultValue = "",
  required,
  disabled,
  validation,
  maxLength,
  minLength,
  pattern,
  type,
  validationContext,
}: TextFieldProps) {
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
        pattern: pattern
          ? {
              value: new RegExp(pattern),
              message: "Invalid format",
            }
          : undefined,
      }}
      defaultValue={defaultValue}
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
                type === "textarea" && styles.textarea,
                error && styles.inputTextError,
                disabled && styles.inputTextDisabled,
              ]}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#94A3B8"
              editable={!disabled}
              multiline={type === "textarea"}
              numberOfLines={type === "textarea" ? 4 : 1}
              maxLength={maxLength}
              keyboardType={type === "email" ? "email-address" : "default"}
              autoCapitalize={type === "email" ? "none" : "sentences"}
              autoCorrect={type !== "email"}
              onFocus={handleFocus}
            />
          </View>

          {error && (
            <Text style={styles.errorText}>{error.message as string}</Text>
          )}

          {maxLength && (
            <Text style={styles.characterCount}>
              {value?.length || 0}/{maxLength}
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
    minHeight: 46,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  inputTextError: {
    color: "#EF4444",
  },
  inputTextDisabled: {
    color: "#94A3B8",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    textAlign: "right",
    marginTop: 4,
  },
});
