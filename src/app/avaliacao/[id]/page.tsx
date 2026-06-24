import { db } from "@/db";
import { evaluations, agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

function RatingDisplay({
  label,
  description,
  rating,
}: {
  label: string;
  description: string;
  rating: string;
}) {
  const config: Record<string, { label: string; bg: string; icon: string }> = {
    cumpre: {
      label: "Cumpre",
      bg: "bg-emerald-50 border-emerald-200",
      icon: "✅",
    },
    cumpre_parcialmente: {
      label: "Cumpre Parcialmente",
      bg: "bg-amber-50 border-amber-200",
      icon: "⚠️",
    },
    nao_cumpre: {
      label: "Não Cumpre",
      bg: "bg-red-50 border-red-200",
      icon: "❌",
    },
  };

  const c = config[rating] || {
    label: rating,
    bg: "bg-gray-50 border-gray-200",
    icon: "❓",
  };

  return (
    <div className={`rounded-xl border-2 p-5 ${c.bg}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{label}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <span className="text-2xl">{c.icon}</span>
          <span className="font-bold text-sm">{c.label}</span>
        </div>
      </div>
    </div>
  );
}

export default async function EvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const evalId = Number(id);

  const [evaluation] = await db
    .select({
      id: evaluations.id,
      agentId: evaluations.agentId,
      agentName: agents.name,
      agentRank: agents.rank,
      agentUnit: agents.unit,
      evaluatorName: evaluations.evaluatorName,
      evaluationDate: evaluations.evaluationDate,
      modusOperandi: evaluations.modusOperandi,
      elaborarRelatoriosCAD: evaluations.elaborarRelatoriosCAD,
      cumprirOrdens: evaluations.cumprirOrdens,
      humildadeDuvidas: evaluations.humildadeDuvidas,
      observations: evaluations.observations,
      createdAt: evaluations.createdAt,
    })
    .from(evaluations)
    .innerJoin(agents, eq(evaluations.agentId, agents.id))
    .where(eq(evaluations.id, evalId));

  if (!evaluation) {
    notFound();
  }

  // Count ratings
  const ratings = [
    evaluation.modusOperandi,
    evaluation.elaborarRelatoriosCAD,
    evaluation.cumprirOrdens,
    evaluation.humildadeDuvidas,
  ];
  const cumpreCount = ratings.filter((r) => r === "cumpre").length;
  const parcialCount = ratings.filter(
    (r) => r === "cumpre_parcialmente"
  ).length;
  const naoCumpreCount = ratings.filter((r) => r === "nao_cumpre").length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← Voltar ao Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Avaliação #{evaluation.id}
            </h1>
            <div className="mt-2 space-y-1">
              <p className="text-slate-700">
                <span className="text-slate-500">Agente:</span>{" "}
                <span className="font-semibold">
                  {evaluation.agentRank
                    ? `${evaluation.agentRank} `
                    : ""}
                  {evaluation.agentName}
                </span>
                {evaluation.agentUnit && (
                  <span className="text-slate-400">
                    {" "}
                    ({evaluation.agentUnit})
                  </span>
                )}
              </p>
              <p className="text-slate-700">
                <span className="text-slate-500">Avaliador:</span>{" "}
                <span className="font-semibold">
                  {evaluation.evaluatorName}
                </span>
              </p>
              <p className="text-slate-700">
                <span className="text-slate-500">Data:</span>{" "}
                <span className="font-semibold">
                  {new Date(evaluation.evaluationDate).toLocaleDateString(
                    "pt-PT",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </p>
            </div>
          </div>
          <DeleteButton evaluationId={evaluation.id} />
        </div>

        {/* Summary Badges */}
        <div className="mt-6 flex gap-4">
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
            <span className="text-lg">✅</span>
            <div>
              <p className="text-xs text-emerald-600 font-medium">Cumpre</p>
              <p className="text-xl font-bold text-emerald-700">
                {cumpreCount}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="text-xs text-amber-600 font-medium">Parcial</p>
              <p className="text-xl font-bold text-amber-700">
                {parcialCount}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            <span className="text-lg">❌</span>
            <div>
              <p className="text-xs text-red-600 font-medium">Não Cumpre</p>
              <p className="text-xl font-bold text-red-700">
                {naoCumpreCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Criteria Details */}
      <div className="space-y-4 mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Critérios de Avaliação
        </h2>

        <RatingDisplay
          label="Conhecimentos básicos do Modus Operandi"
          description="Abordagens, comunicação com civis, restrições de patentes, etc."
          rating={evaluation.modusOperandi}
        />
        <RatingDisplay
          label="Capacidade de elaborar relatórios CAD"
          description="Qualidade e precisão na elaboração de relatórios"
          rating={evaluation.elaborarRelatoriosCAD}
        />
        <RatingDisplay
          label="Capacidade de cumprir ordens"
          description="Obediência e execução de ordens superiores"
          rating={evaluation.cumprirOrdens}
        />
        <RatingDisplay
          label="Humildade para assumir as dúvidas e esclarecê-las"
          description="Capacidade de reconhecer limitações e procurar esclarecer"
          rating={evaluation.humildadeDuvidas}
        />
      </div>

      {/* Observations */}
      {evaluation.observations && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Observações
          </h2>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {evaluation.observations}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
