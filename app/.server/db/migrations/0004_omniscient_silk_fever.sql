ALTER TYPE "user_role" ADD VALUE 'super_admin';--> statement-breakpoint
ALTER TABLE "conversation" ADD COLUMN "image" varchar;--> statement-breakpoint
ALTER TABLE "conversation" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "middle_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "nickname" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_approved" boolean DEFAULT false NOT NULL;