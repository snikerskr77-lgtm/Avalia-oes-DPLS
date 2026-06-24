"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Agent = {
  id: number;
  name: string;
  rank: string | null;
  unit: string | null;
  createdAt: Date;
};

type RatingValue = "cumpre" | "cumpre_parcialmente" | "nao_cumpre" | "";

const CRITERIA = [
  {
    key: "modusOperandi",
    label: "Conhecimentos básicos do Modus Operandi",
    description:
      "Abordagens, comunicação com civis, restrições de patentes, etc.",
  },
  {
    key: "elaborarRelatoriosCAD",
    label: "Capacidade de elaborar relatórios CAD",
    description: "Qualidade e precisão na elaboração de relatórios",
  },
  {
    key: "cumprirOrdens",
    label: "Capacidade de cumprir ordens",
    description: "Obediência e execução de ordens superiores",
  },
  {
    key: "humildadeDuvidas",
    label: "Humildade para assumir as dúvidas e esclarecê-las",
    description: "Capacidade de reconhecer limitações e procurar esclarecer",
  },
] as const;

const RATING_OPTIONS: { value: "cumpre" | "cumpre_parcialmente" | "nao_cumpre"; label: string; color: string }[] = [
  {
    value: "cumpre",
    label: "Cumpre",
    color: "border-emerald-300 bg-emerald-50 text-emerald-800 peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500",
  },
  {
    value: "cumpre_parcialmente",
    label: "Cumpre Parcialmente",
    color: "border-amber-300 bg-amber-50 text-amber-800 peer-checked:bg-amber-500 peer-checked:text-white peer-checked:border-amber-500",
  },
  {
    value: "nao_cumpre",
    label: "Não Cumpre",
    color: "border-red-300 bg-red-50 text-red-800 peer-checked:bg-red-500 peer-checked:text-white peer-checked:border-red-500",
  },
];

export default function EvaluationForm({ agents }: { agents: Agent[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showNewAgent, setShowNewAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentRank, setNewAgentRank] = useState("");
  const [newAgentUnit, setNewAgentUnit] = useState("");

  const [form, setForm] = useState({
    agentId: "",
    evaluatorName: "",
    modusOperandi: "" as RatingValue,
    elaborarRelatoriosCAD: "" as RatingValue,
    cumprirOrdens: "" as RatingValue,
    humildadeDuvidas: "" as RatingValue,
    observations: "",
  });

  const handleRatingChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) return;

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAgentName,
          rank: newAgentRank || null,
          unit: newAgentUnit || null,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar agente");

      const agent = await res.json();
      setForm((prev) => ({ ...prev, agentId: String(agent.id) }));
      setShowNewAgent(false);
      setNewAgentName("");
      setNewAgentRank("");
      setNewAgentUnit("");
      router.refresh();
    } catch {
      setError("Erro ao criar agente. Tente novamente.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !form.agentId ||
      !form.evaluatorName ||
      !form.modusOperandi ||
      !form.elaborarRelatoriosCAD ||
      !form.cumprirOrdens ||
      !form.humildadeDuvidas
    ) {
      setError("Todos os campos obrigatórios devem ser preenchidos.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: Number(form.agentId),
          evaluatorName: form.evaluatorName,
          modusOperandi: form.modusOperandi,
          elaborarRelatoriosCAD: form.elaborarRelatoriosCAD,
          cumprirOrdens: form.cumprirOrdens,
          humildadeDuvidas: form.humildadeDuvidas,
          observations: form.observations || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar avaliação");
      }

      const evaluation = await res.json();
      router.push(`/avaliacao/${evaluation.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao submeter avaliação."
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Agent Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Dados do Agente
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Selecionar Agente *
            </label>
            <div className="flex gap-2">
              <select
                value={form.agentId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, agentId: e.target.value }))
                }
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">-- Selecionar Agente --</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.rank ? `${agent.rank} ` : ""}
                    {agent.name}
                    {agent.unit ? ` (${agent.unit})` : ""}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewAgent(!showNewAgent)}
                className="px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                {showNewAgent ? "Cancelar" : "+ Novo Agente"}
              </button>
            </div>
          </div>

          {showNewAgent && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">
                Registar Novo Agente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Nome *"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="Posto / Patente"
                  value={newAgentRank}
                  onChange={(e) => setNewAgentRank(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="Unidade"
                  value={newAgentUnit}
                  onChange={(e) => setNewAgentUnit(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="button"
                onClick={handleCreateAgent}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Registar Agente
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome do Avaliador *
            </label>
            <input
              type="text"
              value={form.evaluatorName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, evaluatorName: e.target.value }))
              }
              placeholder="Insira o nome de quem avalia"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Criteria Ratings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">
          Critérios de Avaliação
        </h2>

        <div className="space-y-8">
          {CRITERIA.map((criterion) => (
            <div key={criterion.key} className="space-y-3">
              <div>
                <h3 className="font-medium text-slate-900">
                  {criterion.label} *
                </h3>
                <p className="text-sm text-slate-500">
                  {criterion.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {RATING_OPTIONS.map((option) => (
                  <label key={option.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name={criterion.key}
                      value={option.value}
                      checked={
                        form[criterion.key as keyof typeof form] ===
                        option.value
                      }
                      onChange={() =>
                        handleRatingChange(criterion.key, option.value)
                      }
                      className="peer sr-only"
                    />
                    <div
                      className={`px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${option.color}`}
                    >
                      {option.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Observações
        </h2>
        <textarea
          value={form.observations}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, observations: e.target.value }))
          }
          rows={5}
          placeholder="Aqui pode adicionar observações em relação à avaliação, justificações das classificações atribuídas, ou outras informações relevantes..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-y"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4">
        <a
          href="/"
          className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {submitting ? "A submeter..." : "Submeter Avaliação"}
        </button>
      </div>
    </form>
  );
}
