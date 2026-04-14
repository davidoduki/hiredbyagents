import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Prisma 6 skips automatic .env loading when prisma.config.ts is present.
// Load .env.local first (dev), fall back to .env.
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
});
