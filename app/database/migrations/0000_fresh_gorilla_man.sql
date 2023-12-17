DO $$ BEGIN
 CREATE TYPE "UserType" AS ENUM('admin', 'premium', 'free');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"phone" varchar(12) NOT NULL,
	"type" "UserType" NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
