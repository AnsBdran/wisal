import { messages, users } from '~/.server/db/schema';

export type User = typeof users.$inferSelect;
export type Message = typeof messages.$inferSelect & {
  sender: typeof users.$inferSelect;
};
// export type User = Omit<typeof user.$inferSelect, 'password'>;
