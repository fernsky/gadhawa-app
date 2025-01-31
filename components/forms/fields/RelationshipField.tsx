import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import * as Haptics from "expo-haptics";
import { ChevronDownIcon, CheckIcon } from "react-native-heroicons/outline";
import Modal from "@/components/ui/Modal";
import { SearchBar } from "@/components/ui/SearchBar";
import { ChipsWrapper } from "./ChipsWrapper";
import { RelationshipFieldConfig } from "@/types/forms";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { Q } from "@nozbe/watermelondb";

interface RelationshipFieldProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  relationTo: string;
  multiple?: boolean;
  searchFields?: string[];
  displayField?: string | ((entity: any) => string);
}

export default function RelationshipField({
  name,
  label,
  description,
  placeholder = "Select related items",
  required,
  disabled,
  relationTo,
  multiple,
  searchFields = ["name"],
  displayField = "name",
}: RelationshipFieldProps) {
  const database = useDatabase();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [entities, setEntities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const error = errors[name];

  // Fetch entities from local database
  const fetchLocalEntities = useCallback(
    async (searchTerm: string) => {
      try {
        setIsLoading(true);
        const collection = database.get(relationTo);
        let query = collection.query();

        if (searchTerm && searchFields.length) {
          query = query.extend(
            Q.or(
              ...searchFields.map((field) =>
                Q.where(field, Q.like(`%${searchTerm}%`))
              )
            )
          );
        }

        const results = await query.fetch();
        setEntities(results);
      } catch (err) {
        console.error("Error fetching local entities:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [database, relationTo, searchFields]
  );

  // Handle search
  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearch(searchTerm);
      fetchLocalEntities(searchTerm);
    },
    [fetchLocalEntities]
  );

  // Load initial data
  React.useEffect(() => {
    fetchLocalEntities("");
  }, [fetchLocalEntities]);

  const formatOptionLabel = useCallback(
    (entity: any) => {
      if (typeof displayField === "function") {
        return displayField(entity);
      }
      return entity[displayField] || entity.id;
    },
    [displayField]
  );

  // Render list item
  const renderItem = ({ item, selected, onSelect }: any) => (
    <TouchableOpacity
      style={[styles.option, selected && styles.optionSelected]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect(item);
      }}
      disabled={disabled}
    >
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {formatOptionLabel(item)}
      </Text>
      {selected && <CheckIcon size={20} color="#3B82F6" />}
    </TouchableOpacity>
  );

  // Handle selection
  const handleSelect = (
    onChange: (value: any) => void,
    currentValue: any,
    entity: any
  ) => {
    if (multiple) {
      const values = Array.isArray(currentValue) ? currentValue : [];
      const isSelected = values.some((v) => v.id === entity.id);

      if (isSelected) {
        onChange(values.filter((v) => v.id !== entity.id));
      } else {
        onChange([...values, entity]);
      }
    } else {
      onChange(entity);
      setIsOpen(false);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required && "This field is required",
        validate: (value) => {
          if (!value) return true;
          if (multiple && required && (!value || value.length === 0)) {
            return "Please select at least one item";
          }
          return true;
        },
      }}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          {/* Label section */}
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>

          {/* Selection button */}
          <TouchableOpacity
            style={[
              styles.selectButton,
              error && styles.selectError,
              disabled && styles.selectDisabled,
            ]}
            onPress={() => !disabled && setIsOpen(true)}
            disabled={disabled}
          >
            {multiple ? (
              value?.length > 0 ? (
                <ChipsWrapper
                  values={value.map((v: any) => v.id)}
                  options={value.map((v: any) => ({
                    value: v.id,
                    label: formatOptionLabel(v),
                  }))}
                  onRemove={
                    disabled
                      ? undefined
                      : (id) => {
                          onChange(value.filter((v: any) => v.id !== id));
                        }
                  }
                />
              ) : (
                <Text style={styles.placeholder}>{placeholder}</Text>
              )
            ) : (
              <Text
                style={[
                  styles.value,
                  !value && styles.placeholder,
                  error && styles.valueError,
                  disabled && styles.valueDisabled,
                ]}
                numberOfLines={1}
              >
                {value ? formatOptionLabel(value) : placeholder}
              </Text>
            )}
            <ChevronDownIcon
              size={20}
              color={disabled ? "#94A3B8" : "#64748B"}
            />
          </TouchableOpacity>

          {/* Selection modal */}
          <Modal
            visible={isOpen}
            onClose={() => {
              setIsOpen(false);
              setSearch("");
            }}
            title={label}
          >
            <SearchBar
              value={search}
              onChangeText={handleSearch}
              placeholder={`Search ${relationTo}...`}
            />

            <FlatList
              data={entities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                renderItem({
                  item,
                  selected: multiple
                    ? value?.some((v: any) => v.id === item.id)
                    : value?.id === item.id,
                  onSelect: (entity: any) =>
                    handleSelect(onChange, value, entity),
                })
              }
              style={styles.list}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {isLoading ? "Loading..." : "No items found"}
                </Text>
              }
            />
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
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  selectError: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  selectDisabled: {
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
    flex: 1,
    color: "#94A3B8",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  valueError: {
    color: "#EF4444",
  },
  valueDisabled: {
    color: "#94A3B8",
  },
  list: {
    flex: 1,
    marginTop: 12,
  },
  listContent: {
    padding: 4,
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
  optionText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#1F2937",
  },
  optionTextSelected: {
    color: "#3B82F6",
    fontFamily: "Inter_500Medium",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    padding: 20,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
});
