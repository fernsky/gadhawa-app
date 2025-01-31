import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useForm, FormProvider } from "react-hook-form";
import {
  TextField,
  NumberField,
  SelectField,
  //GeoField,
  ImageField,
} from "@/components/forms/fields";

export default function BuildingSurvey() {
  const methods = useForm({
    defaultValues: {
      name: "",
      ward: "",
      tole: "",
      streetName: "",
      houseNumber: "",
      landmark: "",
      buildingType: "",
      constructionType: "",
      totalFloors: 1,
      constructionYear: undefined,
      landArea: undefined,
      builtArea: undefined,
    },
  });

  return (
    <FormProvider {...methods}>
      <ScrollView style={styles.container}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <TextField
            name="name"
            label="Building Name"
            placeholder="Enter building name"
            validationContext={{ formData: methods.getValues() }}
            type="text"
            id="name"
          />
          <NumberField
            name="ward"
            label="Ward Number"
            placeholder="Enter ward number"
            required
            validationContext={{ formData: methods.getValues() }}
            min={1}
            max={32}
            type="number"
            id="ward"
          />
          <TextField
            name="tole"
            label="Tole/Area"
            placeholder="Enter tole or area name"
            required
            validationContext={{ formData: methods.getValues() }}
            type="text"
            id="tole"
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          {/* <GeoField
            name="location"
            label="Building Location"
            required
            requireAccuracy={10}
            validationContext={{ formData: methods.getValues() }}
            type="geo"
            id="location"
          /> */}
          <TextField
            name="streetName"
            label="Street Name"
            placeholder="Enter street name"
            validationContext={{ formData: methods.getValues() }}
            type="text"
            id="streetName"
          />
          <TextField
            name="houseNumber"
            label="House Number"
            placeholder="Enter house number"
            validationContext={{ formData: methods.getValues() }}
            type="text"
            id="houseNumber"
          />
          <TextField
            name="landmark"
            label="Nearest Landmark"
            placeholder="Enter nearest landmark"
            validationContext={{ formData: methods.getValues() }}
            type="text"
            id="landmark"
          />
        </View>

        {/* Building Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Building Details</Text>
          <SelectField
            name="buildingType"
            label="Building Type"
            required
            options={[
              { label: "Residential", value: "residential" },
              { label: "Commercial", value: "commercial" },
              { label: "Mixed Use", value: "mixed" },
              { label: "Institutional", value: "institutional" },
            ]}
            validationContext={{ formData: methods.getValues() }}
            type="select"
            id="buildingType"
          />
          <SelectField
            name="constructionType"
            label="Construction Type"
            required
            options={[
              { label: "RCC Frame", value: "rcc" },
              { label: "Load Bearing", value: "load-bearing" },
              { label: "Wooden Frame", value: "wooden" },
              { label: "Other", value: "other" },
            ]}
            validationContext={{ formData: methods.getValues() }}
            type="select"
            id="constructionType"
          />
          <NumberField
            name="totalFloors"
            label="Total Floors"
            required
            min={1}
            max={50}
            validationContext={{ formData: methods.getValues() }}
            type="number"
            id="totalFloors"
          />
          <NumberField
            name="constructionYear"
            label="Construction Year"
            min={1900}
            max={new Date().getFullYear()}
            validationContext={{ formData: methods.getValues() }}
            type="number"
            id="constructionYear"
          />
        </View>

        {/* Area Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Area Information</Text>
          <NumberField
            name="landArea"
            label="Land Area (sq. ft)"
            min={0}
            unit="sq. ft"
            validationContext={{ formData: methods.getValues() }}
            type="number"
            id="landArea"
          />
          <NumberField
            name="builtArea"
            label="Built Area (sq. ft)"
            min={0}
            unit="sq. ft"
            validationContext={{ formData: methods.getValues() }}
            type="number"
            id="builtArea"
          />
        </View>

        {/* Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Building Images</Text>
          <ImageField
            name="images"
            label="Building Photos"
            required
            maxFiles={4}
            type="image"
            id="images"
          />
        </View>
      </ScrollView>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#0F172A",
    marginBottom: 16,
  },
});
