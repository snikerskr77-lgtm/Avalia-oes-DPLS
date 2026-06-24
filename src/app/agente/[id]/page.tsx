import { db } from "@/db";
import { agents, evaluations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

function RatingBadge({ rating }: { rating: string }) {
  const labels: Record<string, string> = {
    cumpre: "Cumpre",
    cumpre_parcialmente: "Parcial",
    nao_cumpre: "Não Cumpre",
  };
  const colors: Record<string, string> = {
    cumpre: "bg-emerald-100 text-emerald-800",
    cumpre_parcialmente: "bg-amber-100 text-amber-800",
    nao_cumpre: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colors[rating] || "bg-gray-100"}`}
    >
      {labels[rating] || rating}
    </span>
  );
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agentId = Number(id);

  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.id, agentId));

  if (!agent) {
    notFound();
  }

  const agentEvaluations = await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.agentId, agentId))
    .orderBy(desc(evaluations.createdAt));

  // Stats
  const allRatings = agentEvaluations.flatMap((e) => [
    e.modusOperandi,
    e.elaborarRelatoriosCAD,
    e.cumprirOrdens,
    e.humildadeDuvidas,
  ]);
  const totalCumpre = allRatings.filter((r) => r === "cumpre").length;
  const totalParcial = allRatings.filter(
    (r) => r === "cumpre_parcialmente"
  ).length;
  const totalNaoCumpre = allRatings.filter((r) => r === "nao_cumpre").length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/agentes"
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← Voltar aos Agentes
        </Link>
      </div>

      {/* Agent Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white text-xl">
              {agent.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {agent.rank ? `${agent.rank} ` : ""}
                {agent.name}
              </h1>
              <p className="text-slate-500">
                {agent.unit || "Sem unidade atribuída"} •{" "}
                {agentEvaluations.length}{" "}
                {agentEvaluations.length === 1 ? "avaliação" : "avaliações"}
              </p>
            </div>
          </div>
          <Link
            href={`/avaliar?agentId=${agent.id}`}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors"
          >
            Nova Avaliação
          </Link>
        </div>

        {/* Stats */}
        {agentEvaluations.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-200">
              <p className="text-3xl font-bold text-emerald-700">
                {totalCumpre}
              </p>
              <p className="text-sm text-emerald-600 font-medium">Cumpre</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center border border-amber-200">
              <p className="text-3xl font-bold text-amber-700">
                {totalParcial}
              </p>
              <p className="text-sm text-amber-600 font-medium">
                Cumpre Parcialmente
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <p className="text-3xl font-bold text-red-700">
                {totalNaoCumpre}
              </p>
              <p className="text-sm text-red-600 font-medium">Não Cumpre</p>
            </div>
          </div>
        )}
      </div>

      {/* Evaluations List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Histórico de Avaliações
          </h2>
        </div>

        {agentEvaluations.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500 mb-4">
              Este agente ainda não tem avaliações.
            </p>
            <Link
              href={`/avaliar?agentId=${agent.id}`}
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium text-sm transition-colors"
            >
              Criar Avaliação
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {agentEvaluations.map((ev) => (
              <Link
                key={ev.id}
                href={`/avaliacao/${ev.id}`}
                className="block px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold text-slate-900">
                      Avaliação #{ev.id}
                    </span>
                    <span className="text-sm text-slate-500 ml-2">
                      por {ev.evaluatorName}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {new Date(ev.evaluationDate).toLocaleDateString("pt-PT")}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Modus Operandi: </span>
                    <RatingBadge rating={ev.modusOperandi} />
                  </div>
                  <div>
                    <span className="text-slate-500">Relatórios CAD: </span>
                    <RatingBadge rating={ev.elaborarRelatoriosCAD} />
                  </div>
                  <div>
                    <span className="text-slate-500">Ordens: </span>
                    <RatingBadge rating={ev.cumprirOrdens} />
                  </div>
                  <div>
                    <span className="text-slate-500">Humildade: </span>
                    <RatingBadge rating={ev.humildadeDuvidas} />
                  </div>
                </div>
                {ev.observations && (
                  <p className="mt-2 text-sm text-slate-600 line-clamp-1">
                    💬 {ev.observations}
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
