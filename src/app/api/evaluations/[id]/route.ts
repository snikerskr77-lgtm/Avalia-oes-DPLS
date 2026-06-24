import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { evaluations } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const [deleted] = await db
    .delete(evaluations)
    .where(eq(evaluations.id, numericId))
    .returning();

  if (!deleted) {
    return NextResponse.json(
      { error: "Avaliação não encontrada." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}
