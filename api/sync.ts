import { SurveyResponse } from "@/types/models";

export async function syncFormWithBackend(
  formResponse: SurveyResponse
): Promise<void> {
  // Simulate a network request
  console.log("Syncing form with backend:", formResponse);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // ...handle response...
}
