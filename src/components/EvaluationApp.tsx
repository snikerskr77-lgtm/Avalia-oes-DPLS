"use client";

import { useEffect, useMemo, useState } from "react";
import EvaluationForm from "./EvaluationForm";
import EvaluationCard from "./EvaluationCard";
import type { EvaluationDTO } from "@/lib/types";

export default function EvaluationApp() {
  const [items, setItems] = useState<EvaluationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/evaluations")
      .then((r) => r.json())
      .then((data: EvaluationDTO[]) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.agentName.toLowerCase().includes(q) ||
        i.evaluatorName.toLowerCase().includes(q),
    );
  }, [items, query]);

  async function handleDelete(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/evaluations/${id}`, { method: "DELETE" }).catch(() => {});
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10">
      <header className="mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          Departamento · Avaliações de Agentes
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Sistema de Avaliações
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Registe avaliações de desempenho dos agentes com base nos critérios
          oficiais e mantenha um histórico consultável.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <EvaluationForm
            onCreated={(e) => setItems((prev) => [e, ...prev])}
          />
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">
              Histórico{" "}
              <span className="text-sm font-normal text-slate-500">
                ({filtered.length})
              </span>
            </h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar agente / avaliador..."
              className="w-56 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
            />
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center text-sm text-slate-500">
              A carregar avaliações...
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
              <p className="text-sm text-slate-400">
                {items.length === 0
                  ? "Ainda não existem avaliações registadas."
                  : "Nenhum resultado para a pesquisa."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              {filtered.map((e) => (
                <EvaluationCard
                  key={e.id}
                  evaluation={e}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
