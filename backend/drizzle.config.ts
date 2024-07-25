import { defineConfig, Config } from 'drizzle-kit';
import "dotenv/config";

export default defineConfig({
  // Replace the path of your schema
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  extensionsFilters: ["postgis"],
  verbose: true,
  strict: true,
} as Config);