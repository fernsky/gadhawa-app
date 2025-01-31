import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import { SelectFieldConfig, ValidationContext } from "@/types/forms";
import * as Haptics from "expo-haptics";
import { ChipsWrapper } from "./ChipsWrapper";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import Modal from "@/components/ui/Modal";
import SearchBar from "@/components/ui/SearchBar";
import { SelectOption } from "./SelectOption";

interface MultiSelectFieldProps extends SelectFieldConfig {
  name: string;
  validationContext: ValidationContext;
}

export default function MultiSelectField({
  name,
  label,
  description,
  placeholder = "Select options",
  options,
  defaultValue = [],
  required,
  disabled,
  maxSelect,
  searchable,
  validationContext,
}: MultiSelectFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = errors[name];

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleSelect = useCallback(
    (
      onChange: (value: string[]) => void,
      currentValue: string[],
      optionValue: string
    ) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const values = Array.isArray(currentValue) ? currentValue : [];
      const isSelected = values.includes(optionValue);

      if (isSelected) {
        onChange(values.filter((v) => v !== optionValue));
      } else if (!maxSelect || values.length < maxSelect) {
        onChange([...values, optionValue]);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    },
    [maxSelect]
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required && "This field is required",
        validate: (value) => {
          if (required && (!value || value.length === 0)) {
            return "Please select at least one option";
          }
          if (maxSelect && value?.length > maxSelect) {
            return `Maximum ${maxSelect} options allowed`;
          }
          return true;
        },
      }}
      defaultValue={defaultValue}
      render={({ field: { onChange, value = [] } }) => (
        <View style={styles.container}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
            {maxSelect && (
              <Text style={styles.limit}>
                {value.length}/{maxSelect} selected
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.selectButton,
              error && styles.selectError,
              disabled && styles.selectDisabled,
            ]}
            onPress={() => !disabled && setIsOpen(true)}
            disabled={disabled}
          >
            {value.length > 0 ? (
              <ChipsWrapper
                values={value}
                options={options}
                onRemove={
                  disabled
                    ? undefined
                    : (optionValue) => {
                        onChange(
                          value.filter((v: string) => v !== optionValue)
                        );
                      }
                }
              />
            ) : (
              <Text style={styles.placeholder}>{placeholder}</Text>
            )}
            <ChevronDownIcon
              size={20}
              color={disabled ? "#94A3B8" : "#64748B"}
            />
          </TouchableOpacity>

          <Modal
            visible={isOpen}
            onClose={() => {
              setIsOpen(false);
              setSearch("");
            }}
            title={label}
          >
            {searchable && (
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Search options..."
              />
            )}

            <ScrollView style={styles.optionsList}>
              {filteredOptions.map((option) => (
                <SelectOption
                  key={option.value}
                  option={option}
                  isSelected={value.includes(option.value)}
                  onSelect={() =>
                    handleSelect(onChange, value, String(option.value))
                  }
                  disabled={
                    !!(
                      option.disabled ||
                      (maxSelect &&
                        value.length >= maxSelect &&
                        !value.includes(option.value))
                    )
                  }
                />
              ))}
            </ScrollView>
          </Modal>

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
  limit: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#3B82F6",
    marginTop: 2,
  },
  selectButton: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    padding: 8,
  },
  selectError: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  selectDisabled: {
    borderColor: "#E2E8F0",
    backgroundColor: "#F1F5F9",
  },
  placeholder: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#94A3B8",
    padding: 4,
  },
  optionsList: {
    maxHeight: 300,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
});
