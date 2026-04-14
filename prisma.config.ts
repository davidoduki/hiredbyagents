import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Prisma v7 skips automatic .env loading when prisma.config.ts is present.
// Load .env.local first (dev), fall back to .env.
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
