import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format, isValid, parse } from "date-fns";
import * as Haptics from "expo-haptics";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import Modal from "@/components/ui/Modal";

interface DateFieldProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  mode?: "date" | "datetime";
}

export default function DateField({
  name,
  label,
  description,
  placeholder = "Select date",
  required,
  disabled,
  minDate,
  maxDate,
  format: dateFormat = "PP",
  mode = "date",
}: DateFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const error = errors[name];

  const handleChange = (
    onChange: (date: Date) => void,
    event: DateTimePickerEvent,
    date?: Date
  ) => {
    if (event.type === "set" && date) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(date);
      if (Platform.OS === "android") {
        setIsOpen(false);
      }
    } else if (event.type === "dismissed") {
      setIsOpen(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date || !isValid(date)) return "";
    return format(date, dateFormat);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required && "This field is required",
        validate: {
          valid: (value) => {
            if (!value) return true;
            if (!isValid(value)) return "Invalid date";
            if (minDate && value < minDate)
              return `Date must be after ${format(minDate, dateFormat)}`;
            if (maxDate && value > maxDate)
              return `Date must be before ${format(maxDate, dateFormat)}`;
            return true;
          },
        },
      }}
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
              styles.field,
              error && styles.fieldError,
              disabled && styles.fieldDisabled,
            ]}
            onPress={() => !disabled && setIsOpen(true)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.value,
                !value && styles.placeholder,
                error && styles.valueError,
                disabled && styles.valueDisabled,
              ]}
              numberOfLines={1}
            >
              {value ? formatDate(value) : placeholder}
            </Text>
            <CalendarDaysIcon
              size={20}
              color={disabled ? "#94A3B8" : "#64748B"}
            />
          </TouchableOpacity>

          {Platform.OS === "ios" ? (
            <Modal
              visible={isOpen}
              onClose={() => setIsOpen(false)}
              title={label}
              height="auto"
            >
              <DateTimePicker
                value={value || new Date()}
                mode={mode}
                display="spinner"
                onChange={(event, date) => handleChange(onChange, event, date)}
                minimumDate={minDate}
                maximumDate={maxDate}
              />
            </Modal>
          ) : (
            isOpen && (
              <DateTimePicker
                value={value || new Date()}
                mode={mode}
                display="default"
                onChange={(event, date) => handleChange(onChange, event, date)}
                minimumDate={minDate}
                maximumDate={maxDate}
              />
            )
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
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
  },
  fieldError: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  fieldDisabled: {
    borderColor: "#E2E8F0",
    backgroundColor: "#F1F5F9",
  },
  value: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#1F2937",
    marginRight: 8,
  },
  placeholder: {
    color: "#94A3B8",
  },
  valueError: {
    color: "#EF4444",
  },
  valueDisabled: {
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
