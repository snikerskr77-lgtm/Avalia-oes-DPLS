export type ComplianceValue = "cumpre" | "parcialmente" | "nao_cumpre";

export const COMPLIANCE_OPTIONS: {
  value: ComplianceValue;
  label: string;
  color: string;
  dot: string;
}[] = [
  {
    value: "cumpre",
    label: "Cumpre",
    color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    dot: "bg-emerald-400",
  },
  {
    value: "parcialmente",
    label: "Cumpre parcialmente",
    color: "bg-amber-500/15 text-amber-300 border-amber-500/40",
    dot: "bg-amber-400",
  },
  {
    value: "nao_cumpre",
    label: "Não cumpre",
    color: "bg-rose-500/15 text-rose-300 border-rose-500/40",
    dot: "bg-rose-400",
  },
];

export const CRITERIA: {
  key: "modusOperandi" | "relatoriosCad" | "cumprirOrdens" | "humildade";
  label: string;
  hint: string;
}[] = [
  {
    key: "modusOperandi",
    label: "Conhecimentos básicos do Modus Operandi",
    hint: "Abordagens, comunicação com civis, restrições de patentes, etc.",
  },
  {
    key: "relatoriosCad",
    label: "Capacidade de elaborar relatórios CAD",
    hint: "Clareza, rigor e organização dos relatórios.",
  },
  {
    key: "cumprirOrdens",
    label: "Capacidade de cumprir ordens",
    hint: "Disciplina e respeito pela cadeia de comando.",
  },
  {
    key: "humildade",
    label: "Humildade para assumir as dúvidas e esclarecê-las",
    hint: "Reconhece limitações e procura aprender.",
  },
];

export function complianceLabel(value: string): string {
  return (
    COMPLIANCE_OPTIONS.find((o) => o.value === value)?.label ?? "Desconhecido"
  );
}

export function isComplianceValue(value: unknown): value is ComplianceValue {
  return (
    value === "cumpre" || value === "parcialmente" || value === "nao_cumpre"
  );
}

// numeric score used to compute an overall rating
export function complianceScore(value: string): number {
  if (value === "cumpre") return 1;
  if (value === "parcialmente") return 0.5;
  return 0;
}
