import 'dotenv/config';
import { defineConfig, type Config } from 'drizzle-kit';
export default defineConfig({
  dialect: 'postgresql',
  schema: './app/.server/db/schema',
  out: './app/.server/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
}) satisfies Config;
