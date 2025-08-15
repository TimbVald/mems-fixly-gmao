CREATE TYPE "public"."stock_status" AS ENUM('ajouter', 'retirer');--> statement-breakpoint
CREATE TABLE "historique_stock" (
	"id" text PRIMARY KEY NOT NULL,
	"nom" text NOT NULL,
	"quantite" integer NOT NULL,
	"fournisseur" text,
	"prix" real,
	"statut" "stock_status" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"stockId" text,
	"createdById" text
);
--> statement-breakpoint
ALTER TABLE "historique_stock" ADD CONSTRAINT "historique_stock_stockId_stocks_id_fk" FOREIGN KEY ("stockId") REFERENCES "public"."stocks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "historique_stock" ADD CONSTRAINT "historique_stock_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;