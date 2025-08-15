import { pgTable, text, timestamp, boolean, integer, real, pgEnum, primaryKey, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum for Role
export const roleEnum = pgEnum('role', ['PERSONNEL', 'TECHNICIEN', 'ADMIN']);

// Enum for Stock Status
export const stockStatusEnum = pgEnum('stock_status', ['ajouter', 'retirer']);

// User table
export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  matricule: text('matricule'),
  role: roleEnum('role').notNull().default('PERSONNEL'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
}, (table) => ({
  emailUnique: unique().on(table.email),
  matriculeUnique: unique().on(table.matricule),
}));

// Session table
export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => ({
  tokenUnique: unique().on(table.token),
}));

// Account table
export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

// Verification table
export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});



// Equipment table
export const equipments = pgTable('equipments', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  machineName: text('machineName'),
  subAssemblies: text('subAssemblies'),
  criticalityIndex: integer('criticalityIndex'),
  plan: text('plan'),
  characteristics: text('characteristics'),
  technicalFolder: text('technicalFolder'),
  failureOccurrence: integer('failureOccurrence'),
  mtbf: real('mtbf'),
  mttr: real('mttr'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Demandes de travaux (Work Requests)
export const workRequests = pgTable('work_requests', {
  id: text('id').primaryKey(),
  requestNumber: text('requestNumber').notNull().unique(),
  // Identification du demandeur
  requesterLastName: text('requesterLastName').notNull(),
  requesterFirstName: text('requesterFirstName').notNull(),
  // Équipement
  equipmentName: text('equipmentName').notNull(), // Nom de l'équipement pour affichage dans combobox
  // Type de panne
  failureType: text('failureType').notNull(), // mécanique ou électrique
  failureDescription: text('failureDescription').notNull(),
  // Statuts
  workOrderAssigned: boolean('workOrderAssigned').default(false),
  reportCompleted: boolean('reportCompleted').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  equipmentId: text('equipmentId').references(() => equipments.id, { onDelete: 'set null' }),
  createdById: text('createdById').references(() => users.id), // Sera automatiquement rempli
});

// Ordres de travail (Work Orders)
export const workOrders = pgTable('work_orders', {
  id: text('id').primaryKey(),
  workOrderNumber: text('workOrderNumber').notNull().unique(),
  workRequestNumber: text('workRequestNumber').notNull().references(() => workRequests.requestNumber),
  // Type d'intervention
  interventionType: text('interventionType').notNull(), // préventive ou curative
  // Intervenants
  numberOfIntervenants: integer('numberOfIntervenants').notNull(),
  // Planification
  interventionDateTime: timestamp('interventionDateTime').notNull(),
  approximateDuration: integer('approximateDuration'), // en minutes
  // Démarche
  stepsToFollow: text('stepsToFollow').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdById: text('createdById').notNull().references(() => users.id),
});

// Comptes rendus d'intervention (Intervention Reports)
export const interventionReports = pgTable('intervention_reports', {
  id: text('id').primaryKey(),
  reportNumber: text('reportNumber').notNull().unique(),
  workOrderNumber: text('workOrderNumber').references(() => workOrders.workOrderNumber),
  // Description de la panne
  failureType: text('failureType').notNull(),
  failureDescription: text('failureDescription').notNull(),
  // Type d'intervention
  interventionType: text('interventionType').notNull(),
  // Matériel et pièces
  materialUsed: text('materialUsed'),
  // Intervenants
  numberOfIntervenants: integer('numberOfIntervenants').notNull(),
  // Analyse (obligatoire dans le compte rendu)
  causes: text('causes').notNull(),
  symptoms: text('symptoms').notNull(),
  effectsOnEquipment: text('effectsOnEquipment').notNull(),
  // Temps
  repairTime: integer('repairTime').notNull(), // en minutes
  // Démarche
  stepsFollowed: text('stepsFollowed').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  equipmentId: text('equipmentId').references(() => equipments.id, { onDelete: 'set null' }),
  createdById: text('createdById').notNull().references(() => users.id),
});

// Stock table
export const stocks = pgTable('stocks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  supplier: text('supplier'),
  price: real('price'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull(),
}, (table) => ({
  nameUnique: unique().on(table.name),
}));

// Historique Stock table
export const historiqueStock = pgTable('historique_stock', {
  id: text('id').primaryKey(),
  nom: text('nom').notNull(),
  quantite: integer('quantite').notNull(),
  fournisseur: text('fournisseur'),
  prix: real('prix'),
  statut: stockStatusEnum('statut').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  stockId: text('stockId').references(() => stocks.id, { onDelete: 'set null' }),
  createdById: text('createdById').references(() => users.id),
});

// Fiche chantier table
export const ficheChantier = pgTable('fiche_chantier', {
  id: text('id').primaryKey(),
  nom: text('nom').notNull(),
  localisation: text('localisation').notNull(),
  nomEngin: text('nomEngin').notNull(),
  date: timestamp('date').notNull(),
  heureDebut: text('heureDebut').notNull(), // Format HH:MM
  heureFin: text('heureFin').notNull(), // Format HH:MM
  avancement: text('avancement').notNull(),
  kilometrageDebut: real('kilometrageDebut'),
  kilometrageFin: real('kilometrageFin'),
  carburant: real('carburant'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});



// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  createdWorkRequests: many(workRequests),
  createdWorkOrders: many(workOrders),
  createdReports: many(interventionReports),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const equipmentsRelations = relations(equipments, ({ many }) => ({
  workRequests: many(workRequests),
  interventionReports: many(interventionReports),
}));

export const workRequestsRelations = relations(workRequests, ({ one, many }) => ({
  equipment: one(equipments, {
    fields: [workRequests.equipmentId],
    references: [equipments.id],
  }),
  createdBy: one(users, {
    fields: [workRequests.createdById],
    references: [users.id],
  }),
  workOrders: many(workOrders),
}));

export const workOrdersRelations = relations(workOrders, ({ one, many }) => ({
  workRequest: one(workRequests, {
    fields: [workOrders.workRequestNumber],
    references: [workRequests.requestNumber],
  }),
  createdBy: one(users, {
    fields: [workOrders.createdById],
    references: [users.id],
  }),
  interventionReports: many(interventionReports),
}));

export const interventionReportsRelations = relations(interventionReports, ({ one }) => ({
  workOrder: one(workOrders, {
    fields: [interventionReports.workOrderNumber],
    references: [workOrders.workOrderNumber],
  }),
  equipment: one(equipments, {
    fields: [interventionReports.equipmentId],
    references: [equipments.id],
  }),
  createdBy: one(users, {
    fields: [interventionReports.createdById],
    references: [users.id],
  }),
}));

export const stocksRelations = relations(stocks, ({ many }) => ({
  historique: many(historiqueStock),
}));

export const historiqueStockRelations = relations(historiqueStock, ({ one }) => ({
  stock: one(stocks, {
    fields: [historiqueStock.stockId],
    references: [stocks.id],
  }),
  createdBy: one(users, {
    fields: [historiqueStock.createdById],
    references: [users.id],
  }),
}));

export const ficheChantierRelations = relations(ficheChantier, ({ many }) => ({
  // No relations for now as requested - standalone table
}));