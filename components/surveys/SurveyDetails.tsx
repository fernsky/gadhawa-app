import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { useRouter, useSearchParams as useSearchParamsExpo } from "expo-router";
import { useFormStore, FormData } from "@/store/form/store";
import FormWrapper from "@/components/forms/FormWrapper";
import { FormConfig, FormResponse } from "@/types/forms";

export default function SurveyDetails() {
  const router = useRouter();
  const { id } = useSearchParams();
  const { formData, updateFormData } = useFormStore<FormData>();
  const [loading, setLoading] = useState(true);
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [initialData, setInitialData] = useState<Partial<FormResponse>>({});

  useEffect(() => {
    // Fetch survey data based on ID
    const fetchSurvey = async () => {
      if (id) {
        const survey = formData[id];
        if (survey) {
          setFormConfig(survey?.config);
          setInitialData(survey?.responses || {});
        }
      }
      setLoading(false);
    };

    fetchSurvey();
  }, [id, formData]);

  const handleSubmit = async (data: FormResponse) => {
    if (id) {
      updateFormData(id as string, data);
      router.back();
    }
  };

  const handleSaveDraft = async (data: Partial<FormResponse>) => {
    if (id) {
      updateFormData(id as string, { ...data, status: "draft" });
      // Optionally notify the user
    }
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading survey details...</Text>
      </View>
    );
  }

  if (!formConfig) {
    return (
      <View>
        <Text>Survey configuration not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Survey ID: {id}</Text>
      <FormWrapper
        config={formConfig}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
      />
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}
