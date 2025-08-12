ALTER TABLE "work_requests" ALTER COLUMN "createdById" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "work_requests" ADD COLUMN "equipmentName" text NOT NULL;