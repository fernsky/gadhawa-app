import { synchronize } from "@nozbe/watermelondb/sync";
import database from "./index";
import { times } from "lodash";

export async function mySync() {
  await synchronize({
    database,
    sendCreatedAsUpdated: true,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      console.log("Pulling data");
      //   const { data, error } = await supabase.rpc("pull", {
      //     last_pulled_at: lastPulledAt,
      //     schemaversion: schemaVersion,
      //     migration: migration,
      //   });
      const data = {
        changes: {
          wards: {
            created: [],
            updated: [],
            deleted: [],
          },
        },
        timestamp: Date.now(),
      };
      const error = null;
      console.log(error);
      console.log(JSON.stringify(data));
      return {
        changes: data.changes,
        timestamp: data.timestamp,
      };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      console.log("Pushing data");

      //   const { error } = await supabase.rpc("push", { changes });
      const error = null;
      console.log("Error: ", error);

      console.log(changes);

      // push changes to supabase
    },
  });
}
