ALTER TABLE "chats" DROP CONSTRAINT "chats_creator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "creator_id" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats" ADD CONSTRAINT "chats_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
