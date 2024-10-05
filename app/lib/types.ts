import {
  chatMembers,
  chats,
  choices,
  directChatMembers,
  directChats,
  images,
  messages,
  suggestions,
  users,
} from '~/.server/db/schema';

export type UserRecord = typeof users.$inferSelect;
export type UserSession = Omit<UserRecord, 'password' | 'createdAt'>;
// export type UserSession = {
//   id: number;
//   // locale: 'ar' | 'en';
//   firstName: string;
//   lastName: string;
//   userName: string;
//   role: 'admin' | 'user' | 'super_admin';
// };
export type Message = typeof messages.$inferSelect & {
  sender: typeof users.$inferSelect;
};
export type UserRole = 'user' | 'admin' | 'super_admin';
export type Suggestion = typeof suggestions.$inferSelect;
export type ImageType = typeof images.$inferSelect;
export type Choice = typeof choices.$inferSelect;
export type ChatMember = typeof chatMembers.$inferSelect;
export type DirectChatMember = typeof directChatMembers.$inferSelect;
export type ChatMemberWithUser = ChatMember & { user: UserRecord };
export type Chat = typeof chats.$inferSelect;
export type ChatWithMembers = Chat & { members: ChatMemberWithUser[] };
export type DirectChat = typeof directChats.$inferSelect;
export type DirectChatMemberWithUser = DirectChatMember & { user: UserRecord };
export type DirectChatWithMembers = DirectChat & {
  members: DirectChatMemberWithUser[];
};

export type GroupChatType = ChatMember & {
  type: 'group';
  lastMessageAt: string | null;
  chat: ChatWithMembers;
};
export type DirectChatType = DirectChatMember & {
  type: 'direct';
  lastMessageAt: string | null;
  chat: DirectChatWithMembers;
};

export type ChatType = GroupChatType | DirectChatType;

export type MessagesWithSender = (Message & { sender: UserRecord })[];
