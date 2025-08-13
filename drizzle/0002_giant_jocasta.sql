CREATE TABLE "fiche_chantier" (
	"id" text PRIMARY KEY NOT NULL,
	"nom" text NOT NULL,
	"localisation" text NOT NULL,
	"nomEngin" text NOT NULL,
	"date" timestamp NOT NULL,
	"heureDebut" text NOT NULL,
	"heureFin" text NOT NULL,
	"avancement" text NOT NULL,
	"kilometrageDebut" real,
	"kilometrageFin" real,
	"carburant" real,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
