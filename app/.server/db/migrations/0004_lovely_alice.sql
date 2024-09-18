DO $$ BEGIN
 CREATE TYPE "public"."items_per_page" AS ENUM('eight', 'twelve', 'fifteen');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "suggestions" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "suggestions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_prefs" (
	"locale" "locale" DEFAULT 'ar' NOT NULL,
	"items_per_page" "items_per_page" DEFAULT 'twelve' NOT NULL,
	"show_ads" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "is_edited" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "is_edited" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "is_edited" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "locale";