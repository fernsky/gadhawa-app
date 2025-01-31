import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useFormContext } from "react-hook-form";
import { FormSection, ValidationContext, FieldConfig } from "@/types/forms";
import { evaluateFieldDependency } from "@/lib/forms/utils/dependencies";

// Field Components
import TextField from "../fields/TextField";
import NumberField from "../fields/NumberField";
import SelectField from "../fields/SelectField";
import CheckboxField from "../fields/CheckboxField";
import DateField from "../fields/DateField";
import GeoField from "../fields/GeoField";
import ImageField from "../fields/ImageField";
import AudioField from "../fields/AudioField";
import RelationshipField from "../fields/RelationshipField";

interface FormSectionProps {
  section: FormSection;
  validationContext: ValidationContext;
}

const FieldComponents: Record<string, React.ComponentType<any>> = {
  text: TextField,
  number: NumberField,
  select: SelectField,
  multiselect: SelectField,
  checkbox: CheckboxField,
  date: DateField,
  geo: GeoField,
  image: ImageField,
  audio: AudioField,
  relationship: RelationshipField,
};

export default function FormSectionComponent({
  section,
  validationContext,
}: FormSectionProps) {
  const { watch } = useFormContext();
  const formValues = watch();

  // Filter visible fields based on dependencies
  const visibleFields = useMemo(() => {
    return section.fields.filter((field) => {
      if (!field.dependencies?.length) return true;
      return field.dependencies.every((dependency) =>
        evaluateFieldDependency(dependency, formValues)
      );
    });
  }, [section.fields, formValues]);

  // Render individual field based on its type
  const renderField = (field: FieldConfig) => {
    const Component = FieldComponents[field.type];
    if (!Component) {
      console.warn(`No component found for field type: ${field.type}`);
      return null;
    }

    return (
      <View
        key={field.id}
        style={[styles.fieldContainer, field.hidden && styles.hiddenField]}
      >
        <Component
          {...field}
          name={field.id}
          validationContext={validationContext}
          disabled={
            field.disabled ||
            section.dependencies?.some(
              (dep) => !evaluateFieldDependency(dep, formValues)
            )
          }
        />
      </View>
    );
  };

  if (visibleFields.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.fieldsContainer}>
        {visibleFields.map(renderField)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  fieldsContainer: {
    gap: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  hiddenField: {
    display: "none",
  },
  errorContainer: {
    marginTop: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
});
