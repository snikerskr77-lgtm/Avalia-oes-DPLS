import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allAgents = await db
      .select()
      .from(agents)
      .orderBy(desc(agents.createdAt));
    return NextResponse.json(allAgents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agentes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rank, unit } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const [newAgent] = await db
      .insert(agents)
      .values({ name, rank: rank || null, unit: unit || null })
      .returning();

    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Erro ao criar agente" },
      { status: 500 }
    );
  }
}
