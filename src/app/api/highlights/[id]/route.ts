import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Buscar destaques por municipalityId
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const municipalityId = (await params).id;

    if (!municipalityId || typeof municipalityId !== "string") {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const highlights = await prisma.highlight.findMany({
      where: { municipalityId },
      orderBy: { title: "asc" },
    });

    return NextResponse.json(highlights);
  } catch (error) {
    console.error("Erro ao buscar destaques:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// Atualizar um destaque específico
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const updated = await prisma.highlight.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar destaque:", error);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

// Deletar um destaque específico
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    await prisma.highlight.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Destaque removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar destaque:", error);
    return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
  }
}
