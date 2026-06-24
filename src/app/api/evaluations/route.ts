import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { evaluations, agents } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");

    let query = db
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
      .orderBy(desc(evaluations.createdAt));

    if (agentId) {
      const results = await query.where(eq(evaluations.agentId, Number(agentId)));
      return NextResponse.json(results);
    }

    const results = await query;
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return NextResponse.json(
      { error: "Erro ao buscar avaliações" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      agentId,
      evaluatorName,
      modusOperandi,
      elaborarRelatoriosCAD,
      cumprirOrdens,
      humildadeDuvidas,
      observations,
    } = body;

    if (
      !agentId ||
      !evaluatorName ||
      !modusOperandi ||
      !elaborarRelatoriosCAD ||
      !cumprirOrdens ||
      !humildadeDuvidas
    ) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    const [newEvaluation] = await db
      .insert(evaluations)
      .values({
        agentId,
        evaluatorName,
        modusOperandi,
        elaborarRelatoriosCAD,
        cumprirOrdens,
        humildadeDuvidas,
        observations: observations || null,
      })
      .returning();

    return NextResponse.json(newEvaluation, { status: 201 });
  } catch (error) {
    console.error("Error creating evaluation:", error);
    return NextResponse.json(
      { error: "Erro ao criar avaliação" },
      { status: 500 }
    );
  }
}
