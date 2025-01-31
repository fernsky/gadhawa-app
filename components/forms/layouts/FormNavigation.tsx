import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import * as Haptics from "expo-haptics";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DocumentIcon,
  CheckIcon,
} from "react-native-heroicons/outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onSaveDraft?: () => void;
  isDirty?: boolean;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

export default function FormNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  onSaveDraft,
  isDirty = false,
  isSubmitting = false,
  isLastStep = false,
}: FormNavigationProps) {
  const insets = useSafeAreaInsets();

  const handleSaveDraft = async () => {
    if (!onSaveDraft || !isDirty) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await onSaveDraft();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error saving draft:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSubmit();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onNext();
    }
  };

  const handlePrevious = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPrevious();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      {/* Draft Save Button */}
      {onSaveDraft && (
        <TouchableOpacity
          style={[styles.draftButton, !isDirty && styles.draftButtonDisabled]}
          onPress={handleSaveDraft}
          disabled={!isDirty}
        >
          <DocumentIcon size={16} color={isDirty ? "#3B82F6" : "#94A3B8"} />
          <Text
            style={[styles.draftText, !isDirty && styles.draftTextDisabled]}
          >
            Save Draft
          </Text>
        </TouchableOpacity>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePrevious}
            disabled={isSubmitting}
          >
            <ArrowLeftIcon size={16} color="#64748B" />
            <Text style={styles.backText}>Previous</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            isLastStep && styles.submitButton,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.nextText}>
              {isLastStep ? "Submitting..." : "Saving..."}
            </Text>
          ) : (
            <>
              <Text style={styles.nextText}>
                {isLastStep ? "Submit Form" : "Continue"}
              </Text>
              {isLastStep ? (
                <CheckIcon size={16} color="white" />
              ) : (
                <ArrowRightIcon size={16} color="white" />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Step Indicator */}
      <Text style={styles.stepIndicator}>
        Step {currentStep + 1} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    padding: 16,
  },
  draftButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginBottom: 12,
    gap: 6,
  },
  draftButtonDisabled: {
    opacity: 0.5,
  },
  draftText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#3B82F6",
  },
  draftTextDisabled: {
    color: "#94A3B8",
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    gap: 6,
  },
  backText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#64748B",
  },
  nextButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#3B82F6",
    gap: 6,
  },
  submitButton: {
    backgroundColor: "#10B981",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  nextText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "white",
  },
  stepIndicator: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    textAlign: "center",
    marginTop: 12,
  },
});
