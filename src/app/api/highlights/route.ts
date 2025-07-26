import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Criar um novo destaque
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const highlight = await prisma.highlight.create({
      data: {
        title: data.title,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        municipalityId: data.municipalityId,
      },
    });

    return NextResponse.json(highlight, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar destaque:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar" },
      { status: 500 }
    );
  }
}

// Listar todos os destaques (opcional)
export async function GET() {
  try {
    const highlights = await prisma.highlight.findMany({
      orderBy: { title: "asc" },
    });
    return NextResponse.json(highlights);
  } catch (error) {
    console.error("Erro ao buscar destaques:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
