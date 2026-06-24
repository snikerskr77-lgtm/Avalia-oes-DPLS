"use client";

import { useState } from "react";
import {
  CRITERIA,
  COMPLIANCE_OPTIONS,
  type ComplianceValue,
} from "@/lib/criteria";
import type { EvaluationDTO } from "@/lib/types";

type CriteriaKey = (typeof CRITERIA)[number]["key"];

type FormState = Record<CriteriaKey, ComplianceValue | "">;

const EMPTY_CRITERIA: FormState = {
  modusOperandi: "",
  relatoriosCad: "",
  cumprirOrdens: "",
  humildade: "",
};

export default function EvaluationForm({
  onCreated,
}: {
  onCreated: (e: EvaluationDTO) => void;
}) {
  const [agentName, setAgentName] = useState("");
  const [evaluatorName, setEvaluatorName] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [criteria, setCriteria] = useState<FormState>(EMPTY_CRITERIA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setCriterion(key: CriteriaKey, value: ComplianceValue) {
    setCriteria((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setAgentName("");
    setEvaluatorName("");
    setObservacoes("");
    setCriteria(EMPTY_CRITERIA);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!agentName.trim()) return setError("Indique o nome do agente.");
    if (!evaluatorName.trim()) return setError("Indique o nome do avaliador.");
    for (const c of CRITERIA) {
      if (!criteria[c.key]) {
        return setError(`Avalie o critério: "${c.label}".`);
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: agentName.trim(),
          evaluatorName: evaluatorName.trim(),
          observacoes: observacoes.trim(),
          ...criteria,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Erro ao guardar a avaliação.");
      }
      onCreated(json as EvaluationDTO);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur"
    >
      <h2 className="text-lg font-semibold text-white">Nova avaliação</h2>
      <p className="mt-1 text-sm text-slate-400">
        Preencha os dados do agente e classifique cada critério.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">
            Nome do agente
          </span>
          <input
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="Ex.: MUCAMBU BURLETO"
            className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Avaliador</span>
          <input
            value={evaluatorName}
            onChange={(e) => setEvaluatorName(e.target.value)}
            placeholder="O seu nome / patente"
            className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </label>
      </div>

      <div className="mt-6 space-y-4">
        {CRITERIA.map((c) => (
          <div
            key={c.key}
            className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
          >
            <p className="text-sm font-medium text-white">{c.label}</p>
            <p className="mt-0.5 text-xs text-slate-400">{c.hint}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {COMPLIANCE_OPTIONS.map((opt) => {
                const active = criteria[c.key] === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setCriterion(c.key, opt.value)}
                    className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                      active
                        ? opt.color
                        : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${active ? opt.dot : "bg-slate-600"}`}
                    />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <label className="mt-6 block">
        <span className="text-sm font-medium text-slate-300">Observações</span>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={4}
          placeholder="Comentários sobre o desempenho, pontos a melhorar, etc."
          className="mt-1.5 w-full resize-y rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </label>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "A guardar..." : "Guardar avaliação"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
