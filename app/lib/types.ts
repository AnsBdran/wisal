import { message, user } from '~/.server/db/schema';

export type User = typeof user.$inferSelect;
export type Message = typeof message.$inferSelect & {
  sender: typeof user.$inferSelect;
};
// export type User = Omit<typeof user.$inferSelect, 'password'>;
