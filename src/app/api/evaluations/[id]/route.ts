import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { evaluations, agents } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const evalId = Number(id);

    const [result] = await db
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

    if (!result) {
      return NextResponse.json(
        { error: "Avaliação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching evaluation:", error);
    return NextResponse.json(
      { error: "Erro ao buscar avaliação" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const evalId = Number(id);

    await db.delete(evaluations).where(eq(evaluations.id, evalId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting evaluation:", error);
    return NextResponse.json(
      { error: "Erro ao eliminar avaliação" },
      { status: 500 }
    );
  }
}
