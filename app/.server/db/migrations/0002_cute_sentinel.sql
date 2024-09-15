DO $$ BEGIN
 CREATE TYPE "public"."locale" AS ENUM('ar', 'en');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "locale" "locale" DEFAULT 'ar' NOT NULL;