import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Possible compliance values for each criterion:
// "cumpre" | "parcialmente" | "nao_cumpre"
export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  agentName: text("agent_name").notNull(),
  evaluatorName: text("evaluator_name").notNull(),
  modusOperandi: text("modus_operandi").notNull(),
  relatoriosCad: text("relatorios_cad").notNull(),
  cumprirOrdens: text("cumprir_ordens").notNull(),
  humildade: text("humildade").notNull(),
  observacoes: text("observacoes").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert;
