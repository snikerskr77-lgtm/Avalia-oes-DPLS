import { db } from "@/db";
import { evaluations, agents } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";
import Link from "next/link";

function RatingBadge({ rating }: { rating: string }) {
  const labels: Record<string, string> = {
    cumpre: "Cumpre",
    cumpre_parcialmente: "Cumpre Parcialmente",
    nao_cumpre: "Não Cumpre",
  };

  const colors: Record<string, string> = {
    cumpre: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cumpre_parcialmente: "bg-amber-100 text-amber-800 border-amber-200",
    nao_cumpre: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[rating] || "bg-gray-100 text-gray-800"}`}
    >
      {labels[rating] || rating}
    </span>
  );
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const recentEvaluations = await db
    .select({
      id: evaluations.id,
      agentName: agents.name,
      agentRank: agents.rank,
      evaluatorName: evaluations.evaluatorName,
      evaluationDate: evaluations.evaluationDate,
      modusOperandi: evaluations.modusOperandi,
      elaborarRelatoriosCAD: evaluations.elaborarRelatoriosCAD,
      cumprirOrdens: evaluations.cumprirOrdens,
      humildadeDuvidas: evaluations.humildadeDuvidas,
      observations: evaluations.observations,
    })
    .from(evaluations)
    .innerJoin(agents, eq(evaluations.agentId, agents.id))
    .orderBy(desc(evaluations.createdAt))
    .limit(20);

  const [agentCount] = await db.select({ value: count() }).from(agents);
  const [evalCount] = await db.select({ value: count() }).from(evaluations);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">
          Visão geral das avaliações de agentes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total de Agentes</p>
              <p className="text-2xl font-bold text-slate-900">
                {agentCount?.value ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total de Avaliações</p>
              <p className="text-2xl font-bold text-slate-900">
                {evalCount?.value ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Nova Avaliação</p>
              <Link
                href="/avaliar"
                className="text-amber-600 font-semibold hover:text-amber-700 text-sm"
              >
                Criar agora →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Evaluations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Avaliações Recentes
          </h2>
        </div>

        {recentEvaluations.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-slate-500 mb-4">
              Ainda não existem avaliações registadas.
            </p>
            <Link
              href="/avaliar"
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium text-sm transition-colors"
            >
              Criar Primeira Avaliação
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentEvaluations.map((ev) => (
              <Link
                key={ev.id}
                href={`/avaliacao/${ev.id}`}
                className="block px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {ev.agentRank ? `${ev.agentRank} ` : ""}
                      {ev.agentName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Avaliado por {ev.evaluatorName} •{" "}
                      {new Date(ev.evaluationDate).toLocaleDateString("pt-PT")}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2">
                  <RatingBadge rating={ev.modusOperandi} />
                  <RatingBadge rating={ev.elaborarRelatoriosCAD} />
                  <RatingBadge rating={ev.cumprirOrdens} />
                  <RatingBadge rating={ev.humildadeDuvidas} />
                </div>
                {ev.observations && (
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                    {ev.observations}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
