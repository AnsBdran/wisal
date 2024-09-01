import { user } from '~/.server/db/schema';

export type User = Omit<typeof user.$inferSelect, 'password'>;
