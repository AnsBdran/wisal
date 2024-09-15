import { z } from 'zod';

const stringOnlyRegex = /^[a-zA-Z\u0600-\u06FF]+(?: [a-zA-Z\u0600-\u06FF]+)?$/;
// const stringOnlyRegex = /^[\p{L}]+$/u;

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(4),
});

export const commentSchema = z.object({
  content: z.string().min(1),
  userID: z.number(),
  postID: z.number(),
});

export const profileSchema = z.object({
  firstName: z
    .string({ required_error: 'first_name_required' })
    .min(1, 'first_name_required')
    .max(15)
    .regex(stringOnlyRegex, 'string_invalid'),
  middleName: z
    .string()
    .min(1)
    .max(15)
    .regex(stringOnlyRegex, 'string_invalid')
    .optional(),
  lastName: z
    .string({ required_error: 'last_name_required' })
    .min(1, 'last_name_required')
    .max(15)
    .regex(stringOnlyRegex, 'string_invalid'),
  username: z
    .string({ required_error: 'username_required' })
    .min(1, 'username_required')
    .max(20),
  nickname: z.string().max(15).optional(),
  email: z
    .string({ required_error: 'email_required' })
    .email('email_invalid')
    .max(255),
  // profileImage: z.string().max(255).optional(),
  bio: z.string().optional(),
});
