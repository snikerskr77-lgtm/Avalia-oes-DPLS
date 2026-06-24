import { db } from "@/db";
import { agents, evaluations } from "@/db/schema";
import { asc, eq, count } from "drizzle-orm";
import Link from "next/link";
import AddAgentForm from "./AddAgentForm";

export const dynamic = "force-dynamic";

export default async function AgentesPage() {
  const allAgents = await db.select().from(agents).orderBy(asc(agents.name));

  // Get evaluation count per agent
  const evalCounts = await db
    .select({
      agentId: evaluations.agentId,
      count: count(),
    })
    .from(evaluations)
    .groupBy(evaluations.agentId);

  const countMap = new Map(evalCounts.map((e) => [e.agentId, e.count]));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Agentes</h1>
          <p className="mt-1 text-slate-500">
            Gerir o registo de agentes do sistema
          </p>
        </div>
      </div>

      {/* Add Agent Form */}
      <AddAgentForm />

      {/* Agents List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Agentes Registados ({allAgents.length})
          </h2>
        </div>

        {allAgents.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-slate-500">
              Ainda não existem agentes registados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {allAgents.map((agent) => {
              const evalCountVal = countMap.get(agent.id) || 0;
              return (
                <div
                  key={agent.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {agent.rank ? `${agent.rank} ` : ""}
                        {agent.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {agent.unit || "Sem unidade atribuída"} •{" "}
                        {evalCountVal}{" "}
                        {evalCountVal === 1 ? "avaliação" : "avaliações"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/agente/${agent.id}`}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Ver Avaliações
                    </Link>
                    <Link
                      href={`/avaliar?agentId=${agent.id}`}
                      className="px-3 py-1.5 text-sm font-medium text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      Avaliar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
