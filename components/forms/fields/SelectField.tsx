import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import {
  SelectFieldConfig,
  ValidationContext,
  SelectOption,
} from "@/types/forms";
import * as Haptics from "expo-haptics";
import {
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import Modal from "@/components/ui/Modal";

interface SelectFieldProps extends SelectFieldConfig {
  name: string;
  validationContext: ValidationContext;
}

export default function SelectField({
  name,
  label,
  description,
  placeholder = "Select an option",
  options,
  defaultValue,
  required,
  disabled,
  multiple,
  searchable,
  maxSelect,
  validationContext,
}: SelectFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = errors[name];

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleSelect = useCallback(
    (
      onChange: (value: any) => void,
      currentValue: any,
      option: SelectOption
    ) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (multiple) {
        const values = Array.isArray(currentValue) ? currentValue : [];
        const isSelected = values.includes(option.value);

        if (isSelected) {
          onChange(values.filter((v) => v !== option.value));
        } else if (!maxSelect || values.length < maxSelect) {
          onChange([...values, option.value]);
        }
      } else {
        onChange(option.value);
        setIsOpen(false);
      }
    },
    [multiple, maxSelect]
  );

  const renderValue = (value: any) => {
    if (multiple) {
      const selectedOptions = options.filter(
        (opt) => Array.isArray(value) && value.includes(opt.value)
      );
      return selectedOptions.length
        ? selectedOptions.map((opt) => opt.label).join(", ")
        : placeholder;
    }

    const option = options.find((opt) => opt.value === value);
    return option ? option.label : placeholder;
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required && "This field is required" }}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
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

          <TouchableOpacity
            style={[
              styles.selectButton,
              error && styles.selectError,
              disabled && styles.selectDisabled,
            ]}
            onPress={() => !disabled && setIsOpen(true)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.selectText,
                !value && styles.placeholder,
                error && styles.selectTextError,
                disabled && styles.selectTextDisabled,
              ]}
              numberOfLines={1}
            >
              {renderValue(value)}
            </Text>
            <ChevronDownIcon
              size={20}
              color={disabled ? "#94A3B8" : "#64748B"}
            />
          </TouchableOpacity>

          <Modal
            visible={isOpen}
            onClose={() => setIsOpen(false)}
            title={label}
          >
            {searchable && (
              <View style={styles.searchContainer}>
                <MagnifyingGlassIcon size={20} color="#64748B" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search options..."
                  value={search}
                  onChangeText={setSearch}
                  placeholderTextColor="#94A3B8"
                />
                {search ? (
                  <TouchableOpacity onPress={() => setSearch("")}>
                    <XMarkIcon size={20} color="#64748B" />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            <ScrollView style={styles.optionsList}>
              {filteredOptions.map((option) => {
                const isSelected = multiple
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                      option.disabled && styles.optionDisabled,
                    ]}
                    onPress={() =>
                      !option.disabled && handleSelect(onChange, value, option)
                    }
                    disabled={option.disabled}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        option.disabled && styles.optionTextDisabled,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && <CheckIcon size={20} color="#3B82F6" />}
                  </TouchableOpacity>
                );
              })}
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
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
  },
  selectError: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  selectDisabled: {
    borderColor: "#E2E8F0",
    backgroundColor: "#F1F5F9",
  },
  selectText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#1F2937",
    marginRight: 8,
  },
  placeholder: {
    color: "#94A3B8",
  },
  selectTextError: {
    color: "#EF4444",
  },
  selectTextDisabled: {
    color: "#94A3B8",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#F8FAFC",
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#1F2937",
  },
  optionsList: {
    maxHeight: 300,
  },
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
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
});
