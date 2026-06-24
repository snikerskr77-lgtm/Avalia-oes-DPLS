import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

export const ratingEnum = pgEnum("rating", [
  "cumpre",
  "cumpre_parcialmente",
  "nao_cumpre",
]);

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  rank: varchar("rank", { length: 100 }),
  unit: varchar("unit", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  agentId: serial("agent_id")
    .references(() => agents.id)
    .notNull(),
  evaluatorName: varchar("evaluator_name", { length: 255 }).notNull(),
  evaluationDate: timestamp("evaluation_date").defaultNow().notNull(),

  // Criteria ratings
  modusOperandi: ratingEnum("modus_operandi").notNull(),
  elaborarRelatoriosCAD: ratingEnum("elaborar_relatorios_cad").notNull(),
  cumprirOrdens: ratingEnum("cumprir_ordens").notNull(),
  humildadeDuvidas: ratingEnum("humildade_duvidas").notNull(),

  // Observations
  observations: text("observations"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert;
