ALTER TABLE "suggestions" ALTER COLUMN "is_accepted" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "url" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "height" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "width" integer NOT NULL;