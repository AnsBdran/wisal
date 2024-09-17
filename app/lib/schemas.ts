import { z } from 'zod';

const stringOnlyRegex = /^[a-zA-Z\u0600-\u06FF]+(?: [a-zA-Z\u0600-\u06FF]+)?$/;
// const stringOnlyRegex = /^[\p{L}]+$/u;

export const loginSchema = z.object({
  username: z
    .string({ required_error: 'username_required' })
    .min(3, 'username_at_least_three_characters'),
  password: z.string({ required_error: 'password_required' }),
  // .min(6, 'password_at_least_six_characters'),
});

export const commentSchema = z.object({
  content: z.string().min(1),
  userID: z.number(),
  postID: z.number(),
});

export const profileSchema = z.object({
  firstName: z
    .string({ required_error: 'first_name_required' })
    .min(3, 'first_name_at_least_three_characters')
    .max(15, 'first_name_at_most_fifteen_characters')
    .regex(stringOnlyRegex, 'string_invalid'),
  middleName: z
    .string()
    .min(3, 'middle_name_at_least_three_characters')
    .max(15, 'middle_name_at_most_fifteen_characters')
    .regex(stringOnlyRegex, 'string_invalid')
    .optional(),
  lastName: z
    .string({ required_error: 'last_name_required' })
    .min(3, 'last_name_at_least_three_characters')
    .max(15, 'last_name_at_most_fifteen_characters')
    .regex(stringOnlyRegex, 'string_invalid'),
  username: z
    .string({ required_error: 'username_required' })
    .min(3, 'username_at_least_three_characters')
    .max(15, 'username_at_most_fifteen_characters'),
  nickname: z.string().min(1, 'nickname_required').max(15).optional(),
  email: z
    .string({ required_error: 'email_required' })
    .email('email_invalid')
    .max(255),
  // profileImage: z.string().max(255).optional(),
  bio: z.string().optional(),
});

export const appSchema = z.object({
  locale: z.enum(['ar', 'en']),
});

export const postSchema = z.object({
  title: z.string().min(1).max(50).optional(),
  content: z.string().min(5),
  images: z.array(z.instanceof(File)),
});
