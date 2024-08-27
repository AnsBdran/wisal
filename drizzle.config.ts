import { defineConfig, type Config } from 'drizzle-kit';;
export default defineConfig({
    dialect: 'postgresql',
    schema: './app/.server/db/schema',
    out: './app/.server/db/migrations',
    dbCredentials: {
        url: 'postgresql://postgres:Dev.ans.97%40pass@localhost:5432/badran',
    },
    verbose: true,
    strict: true
}) satisfies Config;