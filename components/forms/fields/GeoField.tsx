import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import Modal from "@/components/ui/Modal";
import { MapPinIcon, MapIcon } from "react-native-heroicons/outline";
import { GeoFieldConfig, ValidationContext } from "@/types/forms";
import { GeoLocation } from "@/types/models";

interface GeoFieldProps extends GeoFieldConfig {
  name: string;
  validationContext: ValidationContext;
}

export default function GeoField({
  name,
  label,
  description,
  required,
  disabled,
  requireAccuracy = 100, // Default 100m accuracy
  validationContext,
}: GeoFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const error = errors[name];

  const handleGetLocation = async (onChange: (value: GeoLocation) => void) => {
    try {
      setIsLocating(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (
        location.coords.accuracy &&
        location.coords.accuracy > requireAccuracy
      ) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        // Continue anyway but warn the user
      }

      const geoLocation: GeoLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
        altitude: location.coords.altitude || undefined,
        timestamp: new Date(location.timestamp),
      };

      onChange(geoLocation);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsOpen(true);
    } catch (error) {
      console.error("Error getting location:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLocating(false);
    }
  };

  const handleMapPress = (onChange: (value: GeoLocation) => void, e: any) => {
    const coordinate = e.nativeEvent.coordinate;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      accuracy: undefined,
      timestamp: new Date(),
    });
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required && "Location is required",
        validate: (value: GeoLocation) => {
          if (!value) return required ? "Location is required" : true;
          if (
            requireAccuracy &&
            value.accuracy &&
            value.accuracy > requireAccuracy
          ) {
            return `Location accuracy must be better than ${requireAccuracy}m`;
          }
          return true;
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

          {value ? (
            <TouchableOpacity
              style={[styles.preview, error && styles.previewError]}
              onPress={() => !disabled && setIsOpen(true)}
              disabled={disabled}
            >
              <MapView
                style={styles.previewMap}
                provider={PROVIDER_GOOGLE}
                region={{
                  latitude: value.latitude,
                  longitude: value.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker coordinate={value} />
              </MapView>

              <View style={styles.coordinates}>
                <Text style={styles.coordinateText}>
                  {value.latitude.toFixed(6)}°, {value.longitude.toFixed(6)}°
                </Text>
                {value.accuracy && (
                  <Text style={styles.accuracyText}>
                    ±{Math.round(value.accuracy)}m
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, error && styles.buttonError]}
              onPress={() => handleGetLocation(onChange)}
              disabled={disabled || isLocating}
            >
              <MapPinIcon size={20} color="#3B82F6" />
              <Text style={styles.buttonText}>
                {isLocating ? "Getting Location..." : "Get Current Location"}
              </Text>
            </TouchableOpacity>
          )}

          <Modal
            visible={isOpen}
            onClose={() => setIsOpen(false)}
            title="Select Location"
            height="80%"
          >
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: value?.latitude || 27.7172,
                longitude: value?.longitude || 85.324,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              onPress={(e) => handleMapPress(onChange, e)}
            >
              {value && <Marker coordinate={value} />}
            </MapView>

            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={() => handleGetLocation(onChange)}
              disabled={isLocating}
            >
              <MapIcon size={24} color="#3B82F6" />
            </TouchableOpacity>
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    gap: 8,
  },
  buttonError: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  buttonText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "#3B82F6",
  },
  preview: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
  },
  previewError: {
    borderColor: "#FCA5A5",
  },
  previewMap: {
    height: 120,
    width: "100%",
  },
  coordinates: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  coordinateText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#1F2937",
    textAlign: "center",
  },
  accuracyText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    textAlign: "center",
  },
  map: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  currentLocationButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
});
