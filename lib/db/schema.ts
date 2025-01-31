import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    // Ward table
    tableSchema({
      name: "wards",
      columns: [
        { name: "ward_number", type: "number" },
        { name: "ward_area_code", type: "number" },
        { name: "geometry", type: "string" }, // JSON string of Geometry
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    // Building table
    tableSchema({
      name: "buildings",
      columns: [
        { name: "name", type: "string", isOptional: true },
        { name: "ward", type: "number" },
        { name: "tole", type: "string" },
        { name: "street_name", type: "string", isOptional: true },
        { name: "house_number", type: "string", isOptional: true },
        { name: "landmark", type: "string", isOptional: true },
        { name: "latitude", type: "number" },
        { name: "longitude", type: "number" },
        { name: "accuracy", type: "number", isOptional: true },
        { name: "building_type", type: "string" },
        { name: "construction_type", type: "string" },
        { name: "total_floors", type: "number" },
        { name: "construction_year", type: "number", isOptional: true },
        { name: "land_area", type: "number", isOptional: true },
        { name: "built_area", type: "number", isOptional: true },
        { name: "images", type: "string" }, // JSON string of ImageAsset[]
        { name: "metadata", type: "string", isOptional: true }, // JSON string
        { name: "sync_status", type: "string" },
        { name: "version", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Family table
    tableSchema({
      name: "families",
      columns: [
        { name: "building_id", type: "string", isIndexed: true },
        { name: "head_id", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "member_ids", type: "string" }, // JSON string of IDs
        { name: "economic_status", type: "string" },
        { name: "monthly_income", type: "number", isOptional: true },
        { name: "residency_type", type: "string" },
        { name: "residency_since", type: "number", isOptional: true },
        { name: "images", type: "string", isOptional: true },
        { name: "audio", type: "string", isOptional: true },
        { name: "metadata", type: "string", isOptional: true },
        { name: "sync_status", type: "string" },
        { name: "version", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Individual table
    tableSchema({
      name: "individuals",
      columns: [
        { name: "family_id", type: "string", isIndexed: true },
        { name: "first_name", type: "string" },
        { name: "middle_name", type: "string", isOptional: true },
        { name: "last_name", type: "string" },
        { name: "date_of_birth", type: "number" },
        { name: "gender", type: "string" },
        { name: "marital_status", type: "string" },
        { name: "education", type: "string", isOptional: true }, // JSON string
        { name: "occupation", type: "string", isOptional: true }, // JSON string
        { name: "contact", type: "string", isOptional: true }, // JSON string
        { name: "health_info", type: "string", isOptional: true }, // JSON string
        { name: "images", type: "string", isOptional: true },
        { name: "documents", type: "string", isOptional: true },
        { name: "metadata", type: "string", isOptional: true },
        { name: "sync_status", type: "string" },
        { name: "version", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Business table
    tableSchema({
      name: "businesses",
      columns: [
        { name: "building_id", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "type", type: "string" },
        { name: "registration_no", type: "string", isOptional: true },
        { name: "ownership", type: "string" },
        { name: "established_date", type: "number" },
        { name: "owner_id", type: "string", isIndexed: true },
        { name: "employees", type: "string" }, // JSON string
        { name: "contact", type: "string" }, // JSON string
        { name: "premises", type: "string" }, // JSON string
        { name: "turnover", type: "string", isOptional: true }, // JSON string
        { name: "images", type: "string", isOptional: true },
        { name: "licenses", type: "string", isOptional: true },
        { name: "metadata", type: "string", isOptional: true },
        { name: "sync_status", type: "string" },
        { name: "version", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Survey Response table
    tableSchema({
      name: "survey_responses",
      columns: [
        { name: "survey_id", type: "string", isIndexed: true },
        { name: "entity_type", type: "string" },
        { name: "entity_id", type: "string", isIndexed: true },
        { name: "responses", type: "string" }, // JSON string of responses
        { name: "location", type: "string", isOptional: true }, // JSON string
        { name: "images", type: "string", isOptional: true },
        { name: "audio", type: "string", isOptional: true },
        { name: "completed_by", type: "string" },
        { name: "verified_by", type: "string", isOptional: true },
        { name: "status", type: "string" },
        { name: "metadata", type: "string", isOptional: true },
        { name: "sync_status", type: "string" },
        { name: "version", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Asset tables for offline storage
    tableSchema({
      name: "assets",
      columns: [
        { name: "uri", type: "string" },
        { name: "type", type: "string" },
        { name: "entity_type", type: "string" },
        { name: "entity_id", type: "string", isIndexed: true },
        { name: "metadata", type: "string", isOptional: true },
        { name: "sync_status", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
