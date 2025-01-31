import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useFormContext } from "react-hook-form";
import { FormStep, ValidationContext, FieldConfig } from "@/types/forms";
import { evaluateFieldDependency } from "@/lib/forms/utils/dependencies";
import FormSection from "./FormSection";
import { ChevronDownIcon, ChevronUpIcon } from "react-native-heroicons/outline";
import { TouchableOpacity } from "react-native-gesture-handler";

interface FormStepProps {
  step: FormStep;
  validationContext: ValidationContext;
}

export default function FormStepComponent({
  step,
  validationContext,
}: FormStepProps) {
  const { watch } = useFormContext();
  const formValues = watch();

  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = React.useState<
    Record<string, boolean>
  >({});

  // Evaluate which sections should be visible based on dependencies
  const visibleSections = useMemo(() => {
    return step.sections.filter((section) => {
      if (!section.dependencies?.length) return true;
      return section.dependencies.every((dependency) =>
        evaluateFieldDependency(dependency, formValues)
      );
    });
  }, [step.sections, formValues]);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (visibleSections.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No sections available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {visibleSections.map((section) => (
        <View key={section.id} style={styles.sectionContainer}>
          {/* Section Header */}
          <TouchableOpacity
            onPress={() => toggleSection(section.id)}
            style={styles.sectionHeader}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.description && (
                <Text style={styles.sectionDescription}>
                  {section.description}
                </Text>
              )}
            </View>
            {section.collapsed !== undefined && (
              <View style={styles.sectionIcon}>
                {collapsedSections[section.id] ? (
                  <ChevronDownIcon size={20} color="#64748B" />
                ) : (
                  <ChevronUpIcon size={20} color="#64748B" />
                )}
              </View>
            )}
          </TouchableOpacity>

          {/* Section Content */}
          {!collapsedSections[section.id] && (
            <FormSection
              section={section}
              validationContext={validationContext}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#64748B",
  },
  sectionContainer: {
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8FAFC",
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#0F172A",
  },
  sectionDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});
