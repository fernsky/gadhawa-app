import { Database, Q } from "@nozbe/watermelondb";
import { SurveyResponse } from "@/types/models";
import { syncFormWithBackend } from "../api/sync";
import { SurveyResponseModel } from "@/store/form/store";

export class SyncManager {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async syncPendingForms() {
    try {
      const collection = this.db.get<SurveyResponseModel>("survey_responses");
      const pendingForms = await collection
        .query(Q.where("sync_status", "pending"))
        .fetch();

      for (const form of pendingForms) {
        try {
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

          await syncFormWithBackend(formResponse);

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
  }

  async syncAll() {
    await this.syncPendingForms();
    // Add other sync operations if needed
  }
}

export default SyncManager;
