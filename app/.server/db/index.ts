import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema'
const client = postgres('postgresql://postgres:Dev.ans.97%40pass@localhost:5432/badran'
)

export const db = drizzle(client, { schema, logger: true })