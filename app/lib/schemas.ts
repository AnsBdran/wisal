import { z } from 'zod';
import { messages } from '~/.server/db/schema';

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

export const baseProfileSchema = z.object({
  firstName: z
    .string({ required_error: 'first_name_required' })
    .min(3, 'first_name_at_least_three_characters')
    .max(15, 'first_name_at_most_fifteen_characters')
    .regex(stringOnlyRegex, 'string_invalid'),
  lastName: z
    .string({ required_error: 'last_name_required' })
    .min(3, 'last_name_at_least_three_characters')
    .max(15, 'last_name_at_most_fifteen_characters')
    .regex(stringOnlyRegex, 'string_invalid'),
  username: z
    .string({ required_error: 'username_required' })
    .min(3, 'username_at_least_three_characters')
    .max(15, 'username_at_most_fifteen_characters'),
});

export const editProfileSchema = z.object({
  middleName: z
    .string()
    .min(3, 'middle_name_at_least_three_characters')
    .max(15, 'middle_name_at_most_fifteen_characters')
    .regex(stringOnlyRegex, 'string_invalid')
    .optional(),
  nickname: z.string().min(1, 'nickname_required').max(15).optional(),
  email: z
    .string({ required_error: 'email_required' })
    .email('email_invalid')
    .max(255),
  bio: z.string().optional(),
});

export const registerSchema = baseProfileSchema
  .merge(
    z.object({
      password: z
        .string({ required_error: 'password_required' })
        .min(6, 'password_at_least_six_characters'),
      passwordConfirmation: z.string({
        required_error: 'password_confirmation_required',
      }),
    })
  )
  .refine((value) => value.password === value.passwordConfirmation, {
    message: 'passwords_unmatch',
    path: ['passwordConfirmation'],
  });

export const profileSchema = baseProfileSchema.merge(editProfileSchema);

export const appSchema = z.object({
  locale: z.enum(['ar', 'en']),
});

export const postSchema = z.object({
  title: z.string().min(5, 'title_short').max(50, 'title_long').optional(),
  content: z
    .string({ required_error: 'content_required' })
    .min(25, 'content_short'),
  images: z.array(z.instanceof(File)),
});

export const suggestionSchema = z.object({
  title: z.string({ required_error: 'title_required' }).min(5, 'title_short'),
  description: z
    .string({ required_error: 'description_required' })
    .min(10, 'description_short'),
  isAccepted: z.boolean().default(false),
});

export const suggestionChoiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(5).optional(),
});

export const suggestionEditSchema = suggestionSchema.merge(
  z.object({
    choices: z.array(suggestionChoiceSchema).min(2),
  })
);

// ++++++++++++++++++++++++++++++++++++++++++
// schemas types
export type SuggestionSchema = typeof suggestionSchema;
export type RegisterSchema = typeof registerSchema;
export type SuggestionEditSchema = typeof suggestionEditSchema;
