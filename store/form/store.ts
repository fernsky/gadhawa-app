import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Database, Q, Model } from "@nozbe/watermelondb";
import { SurveyResponse } from "@/types/models";
import { FormResponse } from "@/types/forms";

// Model type for WatermelonDB
export class SurveyResponseModel extends Model {
  static table = "survey_responses";

  // Fields matching schema.ts
  survey_id!: string;
  entity_type!: "building" | "family" | "individual" | "business";
  entity_id!: string;
  responses!: string; // JSON string
  location?: string; // JSON string
  images?: string; // JSON string
  audio?: string; // JSON string
  completed_by!: string;
  verified_by?: string;
  status!: "draft" | "completed" | "verified" | "rejected";
  metadata?: string; // JSON string
  sync_status!: "pending" | "syncing" | "synced" | "error";
  version!: number;
  created_at!: number;
  updated_at!: number;
}

export interface FormState {
  // State
  currentForm: string | null;
  formData: Record<string, Partial<FormResponse>>;
  dirtyFields: Record<string, Set<string>>;
  autoSaveTimers: Record<string, NodeJS.Timeout>;
  db: Database | null;

  // Actions
  setCurrentForm: (formId: string | null) => void;
  updateFormData: (formId: string, data: Partial<FormResponse>) => void;
  markFieldAsDirty: (formId: string, fieldPath: string) => void;
  clearDirtyFields: (formId: string) => void;
  startAutoSave: (formId: string, interval: number) => void;
  stopAutoSave: (formId: string) => void;
  saveDraft: (formId: string) => Promise<void>;
  clearForm: (formId: string) => void;
  setDatabase: (db: Database) => void;
  syncForms: () => Promise<void>;
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentForm: null,
      formData: {},
      dirtyFields: {},
      autoSaveTimers: {},
      db: null,

      // Form management
      setCurrentForm: (formId) => {
        set({ currentForm: formId });
      },

      updateFormData: (formId, data) => {
        set((state) => ({
          formData: {
            ...state.formData,
            [formId]: {
              ...state.formData[formId],
              ...data,
              lastModifiedAt: new Date(),
            },
          },
        }));
      },

      markFieldAsDirty: (formId, fieldPath) => {
        set((state) => {
          const formDirtyFields = state.dirtyFields[formId] || new Set();
          formDirtyFields.add(fieldPath);
          return {
            dirtyFields: {
              ...state.dirtyFields,
              [formId]: formDirtyFields,
            },
          };
        });
      },

      clearDirtyFields: (formId) => {
        set((state) => ({
          dirtyFields: {
            ...state.dirtyFields,
            [formId]: new Set(),
          },
        }));
      },

      // Auto-save functionality
      startAutoSave: (formId, interval) => {
        const state = get();
        if (state.autoSaveTimers[formId]) {
          clearInterval(state.autoSaveTimers[formId]);
        }

        const timer = setInterval(() => {
          const currentState = get();
          if (currentState.dirtyFields[formId]?.size > 0) {
            currentState.saveDraft(formId);
          }
        }, interval);

        set((state) => ({
          autoSaveTimers: {
            ...state.autoSaveTimers,
            [formId]: timer,
          },
        }));
      },

      stopAutoSave: (formId) => {
        const state = get();
        if (state.autoSaveTimers[formId]) {
          clearInterval(state.autoSaveTimers[formId]);
          set((state) => {
            const { [formId]: _, ...rest } = state.autoSaveTimers;
            return { autoSaveTimers: rest };
          });
        }
      },

      // Save draft to local database
      saveDraft: async (formId) => {
        const state = get();
        if (!state.db || !state.formData[formId]) return;

        try {
          await state.db.write(async () => {
            const collection =
              state.db!.get<SurveyResponseModel>("survey_responses");
            const formData = state.formData[formId];

            // Convert FormResponse to SurveyResponseModel format
            const surveyResponse: Partial<SurveyResponseModel> = {
              survey_id: formId,
              entity_type: formData.entityType,
              entity_id: formData.entityId || "",
              responses: JSON.stringify(formData.steps || []),
              location: formData.location
                ? JSON.stringify(formData.location)
                : undefined,
              images: formData.media?.images
                ? JSON.stringify(formData.media.images)
                : undefined,
              audio: formData.media?.audio
                ? JSON.stringify(formData.media.audio)
                : undefined,
              completed_by: formData.submittedBy || "",
              status: "draft",
              sync_status: "pending",
              version: 1,
              created_at: Date.now(),
              updated_at: Date.now(),
              metadata: formData.metadata
                ? JSON.stringify(formData.metadata)
                : undefined,
            };

            await collection.create((record) => {
              Object.assign(record, surveyResponse);
            });
          });

          state.clearDirtyFields(formId);
        } catch (error) {
          console.error("Error saving draft:", error);
        }
      },

      clearForm: (formId) => {
        set((state) => {
          const { [formId]: _, ...restFormData } = state.formData;
          const { [formId]: __, ...restDirtyFields } = state.dirtyFields;
          return {
            formData: restFormData,
            dirtyFields: restDirtyFields,
          };
        });
        get().stopAutoSave(formId);
      },

      // Database operations
      setDatabase: (db) => {
        set({ db });
      },

      syncForms: async () => {
        const state = get();
        if (!state.db) return;

        try {
          const collection =
            state.db.get<SurveyResponseModel>("survey_responses");
          const pendingForms = await collection
            .query(Q.where("sync_status", "pending"))
            .fetch();

          for (const form of pendingForms) {
            try {
              // Convert SurveyResponseModel to SurveyResponse for API
              const formResponse: SurveyResponse = {
                id: form.id,
                surveyId: form.survey_id,
                entityType: form.entity_type,
                entityId: form.entity_id,
                responses: JSON.parse(form.responses),
                location: form.location ? JSON.parse(form.location) : undefined,
                images: form.images ? JSON.parse(form.images) : undefined,
                audio: form.audio ? JSON.parse(form.audio) : undefined,
                completedBy: form.completed_by,
                verifiedBy: form.verified_by,
                status: form.status,
                metadata: form.metadata ? JSON.parse(form.metadata) : undefined,
                syncStatus: form.sync_status,
                version: form.version,
                createdAt: new Date(form.created_at),
                updatedAt: new Date(form.updated_at),
              };

              // TODO: Implement API sync
              // await syncFormWithBackend(formResponse);

              await form.update((record) => {
                record.sync_status = "synced";
              });
            } catch (error) {
              console.error(`Error syncing form ${form.id}:`, error);
              await form.update((record) => {
                record.sync_status = "error";
              });
            }
          }
        } catch (error) {
          console.error("Error syncing forms:", error);
        }
      },
    }),
    {
      name: "form-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        formData: state.formData,
        dirtyFields: Object.fromEntries(
          Object.entries(state.dirtyFields).map(([k, v]) => [k, Array.from(v)])
        ),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.dirtyFields = Object.fromEntries(
            Object.entries(state.dirtyFields).map(([k, v]) => [k, new Set(v)])
          );
        }
      },
    }
  )
);
