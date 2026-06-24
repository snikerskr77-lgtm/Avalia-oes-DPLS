import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { evaluations } from "@/db/schema";
import { isComplianceValue } from "@/lib/criteria";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select()
    .from(evaluations)
    .orderBy(desc(evaluations.createdAt));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  const agentName = String(data.agentName ?? "").trim();
  const evaluatorName = String(data.evaluatorName ?? "").trim();
  const observacoes = String(data.observacoes ?? "").trim();

  if (!agentName) {
    return NextResponse.json(
      { error: "O nome do agente é obrigatório." },
      { status: 400 },
    );
  }
  if (!evaluatorName) {
    return NextResponse.json(
      { error: "O nome do avaliador é obrigatório." },
      { status: 400 },
    );
  }

  const criteriaKeys = [
    "modusOperandi",
    "relatoriosCad",
    "cumprirOrdens",
    "humildade",
  ] as const;

  for (const key of criteriaKeys) {
    if (!isComplianceValue(data[key])) {
      return NextResponse.json(
        { error: `Avaliação inválida para o critério: ${key}.` },
        { status: 400 },
      );
    }
  }

  const [created] = await db
    .insert(evaluations)
    .values({
      agentName,
      evaluatorName,
      modusOperandi: data.modusOperandi as string,
      relatoriosCad: data.relatoriosCad as string,
      cumprirOrdens: data.cumprirOrdens as string,
      humildade: data.humildade as string,
      observacoes,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
