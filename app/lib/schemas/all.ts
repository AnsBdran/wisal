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

export const postImageSchema = z.object({
  height: z.number().int().positive(),
  width: z.number().int().positive(),
  publicID: z.string().min(1),
  secureURL: z.string().url().min(1),
  url: z.string().url().min(1),
  format: z.string().min(1),
});

export const postSchema = z.object({
  title: z.string().min(5, 'title_short').max(50, 'title_long').optional(),
  content: z
    .string({ required_error: 'content_required' })
    .min(25, 'content_short'),
  images: z
    .string()
    .transform((value) => {
      const images = JSON.parse(value);
      return images as z.infer<typeof postImageSchema>[];
    })
    .optional(),
  // images: z.array(postImageSchema).optional(),
});

export const suggestionSchema = z.object({
  title: z.string({ required_error: 'title_required' }).min(5, 'title_short'),
  description: z
    .string({ required_error: 'description_required' })
    .min(10, 'description_short'),
  isAccepted: z
    .union([z.boolean(), z.string()])
    .transform((value) => {
      if (typeof value === 'string') {
        return value === 'true';
      }
      return value;
    })
    .default(false),
});

export const suggestionChoiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(5).optional(),
  id: z.number().optional(),
});

export const suggestionEditSchema = suggestionSchema
  .merge(
    z.object({
      id: z.number().int().positive(),
      choices: z
        .array(suggestionChoiceSchema)
        .min(2)
        .default([
          { title: 'fas', description: '' },
          { title: '', description: '' },
        ]),
      choicesToDelete: z.string().transform((value) => {
        const ids = JSON.parse(value) as number[];
        return ids.map((id) => Number(id));
      }),
      // choicesToDelete: z.array(z.number()),
    })
  )
  .omit({ isAccepted: true });

export const chatGroupSchema = z.object({
  name: z.string({ required_error: 'name_required' }).min(5, 'name_short'),
  bio: z
    .string()
    .min(15, 'bio_short')
    .optional()
    .refine((bio) => !bio || bio.length >= 15, { message: 'bio_short' }),
  members: z
    .string()
    .transform((stringArr) => JSON.parse(stringArr).map(Number) as number[]),
});

// ++++++++++++++++++++++++++++++++++++++++++
// schemas types
export type SuggestionSchemaType = z.infer<typeof suggestionSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type SuggestionEditSchemaType = z.infer<typeof suggestionEditSchema>;
export type SuggestionChoiceSchemaType = z.infer<typeof suggestionChoiceSchema>;
export type ChatGroupSchemaType = z.infer<typeof chatGroupSchema>;
export type PostSchemaType = z.infer<typeof postSchema>;
