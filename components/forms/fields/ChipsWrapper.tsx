import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SelectOption } from "@/types/forms";
import { Chip } from "@/components/ui/Chip";

interface ChipsWrapperProps {
  values: string[];
  options: SelectOption[];
  onRemove?: (value: string) => void;
}

export function ChipsWrapper({ values, options, onRemove }: ChipsWrapperProps) {
  const selectedOptions = options.filter((opt) =>
    values.includes(String(opt.value))
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {selectedOptions.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          onRemove={onRemove ? () => onRemove(String(option.value)) : undefined}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 8,
  },
  content: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 4,
    paddingVertical: 4,
  },
});
