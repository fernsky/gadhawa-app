import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Haptics from "expo-haptics";
import {
  CameraIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "react-native-heroicons/outline";
import { ImageAsset } from "@/types/models";
import { MediaFieldConfig } from "@/types/forms";

interface ImageFieldProps extends MediaFieldConfig {
  name: string;
}

export default function ImageField({
  name,
  label,
  description,
  required,
  disabled,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  quality = 0.7,
  compress = true,
}: ImageFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const error = errors[name];

  const processImage = async (uri: string): Promise<ImageAsset> => {
    if (!compress) {
      return {
        id: Date.now().toString(),
        uri,
        type: "building",
        syncStatus: "pending",
      };
    }

    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1080 } }],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return {
        id: Date.now().toString(),
        uri: result.uri,
        type: "building",
        metadata: {
          width: result.width,
          height: result.height,
          size: 0, // TODO: Implement file size check
        },
        syncStatus: "pending",
      };
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  };

  const handleImagePick = async (
    onChange: (value: ImageAsset[]) => void,
    currentValue: ImageAsset[],
    useCamera: boolean
  ) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (currentValue?.length >= maxFiles) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          });

      if (!result.canceled) {
        setIsProcessing(true);
        const processedImage = await processImage(result.assets[0].uri);
        onChange([...(currentValue || []), processedImage]);
        setIsProcessing(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setIsProcessing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleRemove = (
    onChange: (value: ImageAsset[]) => void,
    currentValue: ImageAsset[],
    id: string
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(currentValue.filter((img) => img.id !== id));
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required && "Please select at least one image",
        validate: (value) => {
          if (required && (!value || value.length === 0)) {
            return "Please select at least one image";
          }
          if (value?.length > maxFiles) {
            return `Maximum ${maxFiles} images allowed`;
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
            {maxFiles > 1 && (
              <Text style={styles.limit}>
                {value?.length || 0}/{maxFiles} images
              </Text>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageList}
            contentContainerStyle={styles.imageListContent}
          >
            {value?.map((image: ImageAsset) => (
              <View key={image.id} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.image} />
                {!disabled && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemove(onChange, value, image.id)}
                  >
                    <XMarkIcon size={16} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {(!value || value.length < maxFiles) && !disabled && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleImagePick(onChange, value, false)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ArrowPathIcon size={24} color="#3B82F6" />
                  ) : (
                    <PhotoIcon size={24} color="#3B82F6" />
                  )}
                  <Text style={styles.addButtonText}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleImagePick(onChange, value, true)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ArrowPathIcon size={24} color="#3B82F6" />
                  ) : (
                    <CameraIcon size={24} color="#3B82F6" />
                  )}
                  <Text style={styles.addButtonText}>Camera</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

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
  limit: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#3B82F6",
    marginTop: 2,
  },
  imageList: {
    flexGrow: 0,
  },
  imageListContent: {
    gap: 8,
    paddingVertical: 8,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#3B82F6",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
});
