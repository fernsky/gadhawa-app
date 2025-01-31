import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FormStep from "./layouts/FormStep";
import ProgressBar from "../ui/ProgressBar";
import FormNavigation from "./layouts/FormNavigation";
import { FormConfig, FormResponse, ValidationContext } from "@/types/forms";
import { useFormStore } from "@/store/form/store";
import { GeoLocation } from "@/types/models";

interface FormWrapperProps {
  config: FormConfig;
  initialData?: Partial<FormResponse>;
  onSubmit: (data: FormResponse) => Promise<void>;
  onSaveDraft?: (data: Partial<FormResponse>) => Promise<void>;
}

export function FormWrapper({
  config,
  initialData,
  onSubmit,
  onSaveDraft,
}: FormWrapperProps) {
  const insets = useSafeAreaInsets();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [location, setLocation] = useState<GeoLocation | undefined>(undefined);
  const { startAutoSave, stopAutoSave } = useFormStore();

  // Set up form with react-hook-form
  const methods = useForm({
    mode: ["onSubmit", "onBlur", "onChange", "onTouched", "all"].includes(
      (config.settings?.validationStrategy ?? "onChange") as string
    )
      ? (config.settings?.validationStrategy as
          | "onSubmit"
          | "onBlur"
          | "onChange"
          | "onTouched"
          | "all")
      : "onChange",
    defaultValues: initialData,
  });

  const {
    handleSubmit,
    formState: { errors, isDirty },
    trigger,
  } = methods;

  // Initialize form
  useEffect(() => {
    if (config.settings?.autoSave) {
      startAutoSave(config.id, config.settings.autoSaveInterval || 30000);
    }

    if (config.settings?.requireLocation) {
      getCurrentLocation();
    }

    return () => {
      if (config.settings?.autoSave) {
        stopAutoSave(config.id);
      }
    };
  }, [config, startAutoSave, stopAutoSave]);

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? undefined,
        altitude: location.coords.altitude || undefined,
        timestamp: new Date(location.timestamp),
      });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  // Navigation handlers
  const handleNext = async () => {
    const currentStep = config.steps[currentStepIndex];
    const isValid = await trigger(currentStep.id as any);

    if (isValid) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStepIndex((prev) =>
        Math.min(prev + 1, config.steps.length - 1)
      );
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handlePrevious = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSaveDraft = async () => {
    if (onSaveDraft) {
      const data = methods.getValues();
      await onSaveDraft({
        ...data,
        status: "draft",
        lastModifiedAt: new Date(),
        location: location ?? undefined,
      });
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const formResponse: FormResponse = {
        formId: config.id,
        version: config.version,
        entityType: config.type,
        entityId: data.entityId,
        steps: data.steps,
        status: "completed",
        location,
        startedAt: initialData?.startedAt || new Date(),
        completedAt: new Date(),
        lastModifiedAt: new Date(),
        submittedBy: "current-user-id", // TODO: Get from auth context
        media: data.media,
      };

      await onSubmit(formResponse);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const currentStep = config.steps[currentStepIndex];
  const progress = (currentStepIndex + 1) / config.steps.length;

  return (
    <FormProvider {...methods}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Progress Bar */}
        <View style={styles.header}>
          <ProgressBar progress={progress} />
          <Text style={styles.stepTitle}>{currentStep.title}</Text>
          {currentStep.description && (
            <Text style={styles.stepDescription}>
              {currentStep.description}
            </Text>
          )}
        </View>

        {/* Form Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <FormStep
            step={currentStep}
            validationContext={{
              formData: methods.getValues(),
              location: location ?? undefined,
              timestamp: new Date(),
            }}
          />
        </ScrollView>

        {/* Navigation */}
        <FormNavigation
          currentStep={currentStepIndex}
          totalSteps={config.steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSaveDraft={
            config.settings?.saveAsDraft ? handleSaveDraft : undefined
          }
          onSubmit={handleSubmit(handleFormSubmit)}
          isDirty={isDirty}
        />
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#0F172A",
    marginTop: 16,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
});

export default FormWrapper;
