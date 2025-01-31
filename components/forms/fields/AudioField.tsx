import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { Controller, useFormContext } from "react-hook-form";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import {
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  PauseIcon,
  XMarkIcon,
  SpeakerWaveIcon as WaveformIcon,
} from "react-native-heroicons/outline";
import { MediaFieldConfig } from "@/types/forms";
import { AudioAsset } from "@/types/models";

interface AudioFieldProps extends MediaFieldConfig {
  name: string;
  maxDuration?: number; // in seconds
  transcribe?: boolean;
}

export default function AudioField({
  name,
  label,
  description,
  required,
  disabled,
  maxDuration = 300, // 5 minutes default
  transcribe = false,
}: AudioFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);

  const recording = useRef<Audio.Recording | null>(null);
  const sound = useRef<Audio.Sound | null>(null);
  const playbackTimer = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async (
    onChange: (value: AudioAsset | null) => void
  ) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recording.current = newRecording;
      setIsRecording(true);

      // Set up duration timer
      const startTime = Date.now();
      const durationTimer = setInterval(() => {
        const currentDuration = (Date.now() - startTime) / 1000;
        setDuration(currentDuration);

        if (currentDuration >= maxDuration) {
          stopRecording(onChange);
          clearInterval(durationTimer);
        }
      }, 100);
    } catch (error) {
      console.error("Failed to start recording:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const stopRecording = async (
    onChange: (value: AudioAsset | null) => void
  ) => {
    try {
      if (!recording.current) return;

      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();
      const { durationMillis } = await recording.current.getStatusAsync();

      recording.current = null;
      setIsRecording(false);
      setDuration(0);

      if (uri) {
        const audioAsset: AudioAsset = {
          id: Date.now().toString(),
          uri,
          duration: durationMillis ? durationMillis / 1000 : 0,
          syncStatus: "pending",
        };

        if (transcribe) {
          // TODO: Implement transcription
          audioAsset.transcript = "";
        }

        onChange(audioAsset);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const togglePlayback = async (uri: string) => {
    try {
      if (isPlaying) {
        if (sound.current) {
          await sound.current.stopAsync();
          await sound.current.unloadAsync();
          if (playbackTimer.current) {
            clearInterval(playbackTimer.current);
          }
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        sound.current = newSound;

        await sound.current.playAsync();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Update playback position
        playbackTimer.current = setInterval(async () => {
          if (sound.current) {
            const status = await sound.current.getStatusAsync();
            if (status.isLoaded) {
              setPlaybackPosition(status.positionMillis / 1000);
              if (!status.isPlaying) {
                setIsPlaying(false);
                setPlaybackPosition(0);
                clearInterval(playbackTimer.current!);
              }
            }
          }
        }, 100);
      }

      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Failed to toggle playback:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required && "Audio recording is required" }}
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
            <View
              style={[
                styles.audioPlayer,
                error && styles.audioPlayerError,
                disabled && styles.audioPlayerDisabled,
              ]}
            >
              <TouchableOpacity
                onPress={() => togglePlayback(value.uri)}
                disabled={disabled}
                style={styles.playButton}
              >
                {isPlaying ? (
                  <PauseIcon size={24} color="#3B82F6" />
                ) : (
                  <PlayIcon size={24} color="#3B82F6" />
                )}
              </TouchableOpacity>

              <View style={styles.audioInfo}>
                <View style={styles.waveform}>
                  <WaveformIcon size={20} color="#3B82F6" />
                  <Text style={styles.duration}>
                    {formatTime(isPlaying ? playbackPosition : value.duration)}
                  </Text>
                </View>
                {value.transcript && (
                  <Text style={styles.transcript}>{value.transcript}</Text>
                )}
              </View>

              {!disabled && (
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onChange(null);
                  }}
                  style={styles.removeButton}
                >
                  <XMarkIcon size={20} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordingButton,
                error && styles.recordButtonError,
                disabled && styles.recordButtonDisabled,
              ]}
              onPress={() => {
                if (isRecording) {
                  stopRecording(onChange);
                } else {
                  startRecording(onChange);
                }
              }}
              disabled={disabled}
            >
              {isRecording ? (
                <>
                  <StopIcon size={24} color="#EF4444" />
                  <Text style={styles.recordingText}>
                    {formatTime(duration)} / {formatTime(maxDuration)}
                  </Text>
                </>
              ) : (
                <>
                  <MicrophoneIcon size={24} color="#3B82F6" />
                  <Text style={styles.recordButtonText}>
                    Tap to Record Audio
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

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
  recordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
  },
  recordingButton: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  recordButtonError: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  recordButtonDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  recordButtonText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "#3B82F6",
  },
  recordingText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
  },
  audioPlayer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
  },
  audioPlayerError: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  audioPlayerDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  audioInfo: {
    flex: 1,
    marginLeft: 12,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  duration: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#64748B",
  },
  transcript: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
});
