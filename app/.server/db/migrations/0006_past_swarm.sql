ALTER TABLE "choices" DROP CONSTRAINT "choices_suggestion_id_suggestions_id_fk";
--> statement-breakpoint
ALTER TABLE "users_prefs" DROP CONSTRAINT "users_prefs_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "votes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "votes_suggestion_id_suggestions_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "votes_choice_id_choices_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "choices" ADD CONSTRAINT "choices_suggestion_id_suggestions_id_fk" FOREIGN KEY ("suggestion_id") REFERENCES "public"."suggestions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_prefs" ADD CONSTRAINT "users_prefs_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_suggestion_id_suggestions_id_fk" FOREIGN KEY ("suggestion_id") REFERENCES "public"."suggestions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_choice_id_choices_id_fk" FOREIGN KEY ("choice_id") REFERENCES "public"."choices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
