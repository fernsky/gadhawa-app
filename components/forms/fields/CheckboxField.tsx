import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import * as Haptics from "expo-haptics";
import { CheckIcon, MinusIcon } from "react-native-heroicons/outline";

interface CheckboxFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  children?: { label: string; value: string }[];
  inline?: boolean;
}

export default function CheckboxField({
  name,
  label,
  description,
  required,
  disabled,
  indeterminate,
  children,
  inline,
}: CheckboxFieldProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];
  const parentValue = watch(name);

  const handleParentChange = (onChange: (value: boolean) => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newValue = !parentValue;
    onChange(newValue);

    // Update children if present
    if (children) {
      children.forEach((child) => {
        setValue(`${name}.${child.value}`, newValue);
      });
    }
  };

  const handleChildChange = (childValue: string, childChecked: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue(`${name}.${childValue}`, !childChecked);

    // Update parent state based on children
    const childrenValues = children!.map((child) =>
      watch(`${name}.${child.value}`)
    );
    const allChecked = childrenValues.every(Boolean);
    const allUnchecked = childrenValues.every((v) => !v);

    setValue(name, allChecked ? true : allUnchecked ? false : "indeterminate");
  };

  const renderCheckbox = (
    checked: boolean,
    onChange: () => void,
    isIndeterminate?: boolean
  ) => (
    <TouchableOpacity
      style={[
        styles.checkbox,
        checked && styles.checkboxChecked,
        disabled && styles.checkboxDisabled,
        error && styles.checkboxError,
      ]}
      onPress={onChange}
      disabled={disabled}
    >
      {isIndeterminate ? (
        <MinusIcon size={14} color="white" />
      ) : checked ? (
        <CheckIcon size={14} color="white" />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required && "This field is required" }}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          <View style={styles.labelContainer}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => handleParentChange(onChange)}
              disabled={disabled}
            >
              {renderCheckbox(
                value === true,
                () => handleParentChange(onChange),
                value === "indeterminate" || indeterminate
              )}
              <View style={styles.labelWrapper}>
                <Text style={styles.label}>
                  {label}
                  {required && <Text style={styles.required}> *</Text>}
                </Text>
                {description && (
                  <Text style={styles.description}>{description}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {children && (
            <View style={[styles.children, inline && styles.childrenInline]}>
              {children.map((child) => (
                <Controller
                  key={child.value}
                  control={control}
                  name={`${name}.${child.value}`}
                  render={({ field: { value: childValue } }) => (
                    <TouchableOpacity
                      style={styles.row}
                      onPress={() => handleChildChange(child.value, childValue)}
                      disabled={disabled}
                    >
                      {renderCheckbox(childValue, () =>
                        handleChildChange(child.value, childValue)
                      )}
                      <Text style={styles.childLabel}>{child.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              ))}
            </View>
          )}

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
    marginBottom: 4,
  },
  labelContainer: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  checkboxDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  checkboxError: {
    borderColor: "#FCA5A5",
  },
  labelWrapper: {
    flex: 1,
    marginLeft: 8,
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
  children: {
    marginLeft: 28,
    gap: 12,
  },
  childrenInline: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  childLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#1F2937",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
});
