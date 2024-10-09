ALTER TABLE "posts_reactions" DROP CONSTRAINT "posts_reactions_post_Id_posts_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts_reactions" ADD CONSTRAINT "posts_reactions_post_Id_posts_id_fk" FOREIGN KEY ("post_Id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
