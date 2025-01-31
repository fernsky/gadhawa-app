import { apiClient } from "./client";
import { Ward, WardList, wardListSchema, wardSchema } from "../lib/types/ward";
import { WardError, WardNotFoundError } from "../lib/types/errors";
import { z } from "zod";
import axios from "axios";
import { database } from "@/db";
import { sanitizeRaw } from "@nozbe/watermelondb/RawRecord";

/**
 * Fetch all wards
 */
export async function getWards(): Promise<WardList> {
  try {
    const response = await apiClient.get<WardList>("/wards");
    return wardListSchema.parse(response.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new WardError(500, "Invalid response format from server");
    }
    if (axios.isAxiosError(error)) {
      throw new WardError(
        error.response?.status || 500,
        error.response?.data?.message || "Failed to fetch wards"
      );
    }
    throw new WardError(500, "Unknown error occurred while fetching wards");
  }
}

/**
 * Fetch a specific ward by ward number
 */
export async function getWard(wardNumber: number): Promise<Ward> {
  try {
    const response = await apiClient.get<Ward>(`/wards/${wardNumber}`);
    return wardSchema.parse(response.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new WardError(500, "Invalid response format from server");
    }
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new WardNotFoundError(wardNumber);
      }
      throw new WardError(
        error.response?.status || 500,
        error.response?.data?.message || "Failed to fetch ward"
      );
    }
    throw new WardError(
      500,
      `Unknown error occurred while fetching ward ${wardNumber}`
    );
  }
}

/**
 * Sync wards with local database
 */
export async function syncWards(): Promise<void> {
  try {
    const wards = await getWards();

    await database.write(async () => {
      const wardsCollection = database.get("wards");

      // Delete existing wards
      await wardsCollection.query().destroyAllPermanently();

      // Insert new wards
      await database.batch(
        ...wards.map((ward) =>
          wardsCollection.prepareCreate((record) => {
            record._raw = sanitizeRaw(
              {
                ward_number: ward.wardNumber,
                ward_area_code: ward.wardAreaCode,
                geometry: JSON.stringify(ward.geometry),
                created_at: new Date(ward.createdAt).getTime(),
                updated_at: new Date(ward.updatedAt).getTime(),
              },
              database.schema.tables.wards
            );
          })
        )
      );
    });
  } catch (error) {
    if (error instanceof WardError) {
      throw error;
    }
    throw new WardError(500, "Failed to sync wards");
  }
}

// Add helper function to get wards from local database
export async function getLocalWards() {
  return await database.get("wards").query().fetch();
}

// Add helper function to get a single ward from local database
export async function getLocalWard(wardNumber: number) {
  const ward = await database
    .get("wards")
    .query(Q.where("ward_number", wardNumber))
    .first();

  if (!ward) {
    throw new WardNotFoundError(wardNumber);
  }

  return ward;
}
