CREATE TYPE "public"."role" AS ENUM('PERSONNEL', 'TECHNICIEN', 'ADMIN');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipments" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"machineName" text,
	"subAssemblies" text,
	"criticalityIndex" integer,
	"plan" text,
	"characteristics" text,
	"technicalFolder" text,
	"failureOccurrence" integer,
	"mtbf" real,
	"mttr" real,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intervention_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"reportNumber" text NOT NULL,
	"workOrderNumber" text,
	"failureType" text NOT NULL,
	"failureDescription" text NOT NULL,
	"interventionType" text NOT NULL,
	"materialUsed" text,
	"numberOfIntervenants" integer NOT NULL,
	"causes" text NOT NULL,
	"symptoms" text NOT NULL,
	"effectsOnEquipment" text NOT NULL,
	"repairTime" integer NOT NULL,
	"stepsFollowed" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"equipmentId" text,
	"createdById" text NOT NULL,
	CONSTRAINT "intervention_reports_reportNumber_unique" UNIQUE("reportNumber")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "stocks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"quantity" integer NOT NULL,
	"supplier" text,
	"price" real,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "stocks_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"matricule" text,
	"role" "role" DEFAULT 'PERSONNEL' NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_matricule_unique" UNIQUE("matricule")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "work_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"workOrderNumber" text NOT NULL,
	"workRequestNumber" text NOT NULL,
	"interventionType" text NOT NULL,
	"numberOfIntervenants" integer NOT NULL,
	"interventionDateTime" timestamp NOT NULL,
	"approximateDuration" integer,
	"stepsToFollow" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdById" text NOT NULL,
	CONSTRAINT "work_orders_workOrderNumber_unique" UNIQUE("workOrderNumber")
);
--> statement-breakpoint
CREATE TABLE "work_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"requestNumber" text NOT NULL,
	"requesterLastName" text NOT NULL,
	"requesterFirstName" text NOT NULL,
	"failureType" text NOT NULL,
	"failureDescription" text NOT NULL,
	"workOrderAssigned" boolean DEFAULT false,
	"reportCompleted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"equipmentId" text,
	"createdById" text NOT NULL,
	CONSTRAINT "work_requests_requestNumber_unique" UNIQUE("requestNumber")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention_reports" ADD CONSTRAINT "intervention_reports_workOrderNumber_work_orders_workOrderNumber_fk" FOREIGN KEY ("workOrderNumber") REFERENCES "public"."work_orders"("workOrderNumber") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention_reports" ADD CONSTRAINT "intervention_reports_equipmentId_equipments_id_fk" FOREIGN KEY ("equipmentId") REFERENCES "public"."equipments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention_reports" ADD CONSTRAINT "intervention_reports_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_workRequestNumber_work_requests_requestNumber_fk" FOREIGN KEY ("workRequestNumber") REFERENCES "public"."work_requests"("requestNumber") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_requests" ADD CONSTRAINT "work_requests_equipmentId_equipments_id_fk" FOREIGN KEY ("equipmentId") REFERENCES "public"."equipments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_requests" ADD CONSTRAINT "work_requests_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;