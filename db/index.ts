import { Platform } from "react-native";
import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema";
import migrations from "./migrations";
import Ward from "@/models/ward";
import * as Crypto from "expo-crypto";
import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";
setGenerator(() => Crypto.randomUUID());

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  // migrations,
  // (optional database name or file system path)
  // dbName: 'myapp',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true /* Platform.OS === 'ios' */,
  // (optional, but you should implement this method)
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
  },
});

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [Ward],
});

export default database;

export const wardsCollection = database.get<Ward>("wards");
