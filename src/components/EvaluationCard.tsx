"use client";

import {
  CRITERIA,
  COMPLIANCE_OPTIONS,
  complianceLabel,
  complianceScore,
} from "@/lib/criteria";
import type { EvaluationDTO } from "@/lib/types";

function badgeFor(value: string) {
  const opt = COMPLIANCE_OPTIONS.find((o) => o.value === value);
  return opt?.color ?? "border-slate-700 bg-slate-800 text-slate-300";
}

function dotFor(value: string) {
  return COMPLIANCE_OPTIONS.find((o) => o.value === value)?.dot ?? "bg-slate-500";
}

export default function EvaluationCard({
  evaluation,
  onDelete,
}: {
  evaluation: EvaluationDTO;
  onDelete: (id: number) => void;
}) {
  const keys = CRITERIA.map((c) => c.key);
  const total = keys.reduce(
    (acc, k) => acc + complianceScore(evaluation[k]),
    0,
  );
  const pct = Math.round((total / keys.length) * 100);

  const ratingColor =
    pct >= 75
      ? "text-emerald-400"
      : pct >= 45
        ? "text-amber-400"
        : "text-rose-400";

  const date = new Date(evaluation.createdAt).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold uppercase tracking-wide text-white">
            {evaluation.agentName}
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Avaliado por {evaluation.evaluatorName} · {date}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${ratingColor}`}>{pct}%</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">
            Aproveitamento
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {CRITERIA.map((c) => (
          <div
            key={c.key}
            className="flex items-center justify-between gap-3 border-b border-slate-800/70 pb-2 last:border-0 last:pb-0"
          >
            <span className="text-sm text-slate-300">{c.label}</span>
            <span
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${badgeFor(
                evaluation[c.key],
              )}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${dotFor(evaluation[c.key])}`}
              />
              {complianceLabel(evaluation[c.key])}
            </span>
          </div>
        ))}
      </div>

      {evaluation.observacoes && (
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Observações
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">
            {evaluation.observacoes}
          </p>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onDelete(evaluation.id)}
          className="text-xs font-medium text-slate-500 transition hover:text-rose-400"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
