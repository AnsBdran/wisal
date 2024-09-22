ALTER TABLE "images" RENAME COLUMN "url" TO "secure_url";--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "public_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "format" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "suggestions" ADD COLUMN "is_accepted" boolean DEFAULT false;