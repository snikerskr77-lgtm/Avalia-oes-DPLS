import { db } from "@/db";
import { agents } from "@/db/schema";
import { asc } from "drizzle-orm";
import EvaluationForm from "./EvaluationForm";

export const dynamic = "force-dynamic";

export default async function AvaliarPage() {
  const allAgents = await db.select().from(agents).orderBy(asc(agents.name));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Nova Avaliação</h1>
        <p className="mt-1 text-slate-500">
          Preencha o formulário para avaliar um agente
        </p>
      </div>

      <EvaluationForm agents={allAgents} />
    </div>
  );
}
