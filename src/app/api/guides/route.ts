import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lista todos os guias de um município
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const municipalityId = searchParams.get("municipalityId");

  if (!municipalityId) {
    return NextResponse.json(
      { error: "ID do município é obrigatório." },
      { status: 400 }
    );
  }

  try {
    const guides = await prisma.guide.findMany({
      where: { municipalityId },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(guides);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar guias." },
      { status: 500 }
    );
  }
}

// POST: Cria um novo guia
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newGuide = await prisma.guide.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        description: data.description,
        languages: data.languages,
        municipalityId: data.municipalityId,
      },
    });
    return NextResponse.json(newGuide, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar guia." }, { status: 500 });
  }
}

// PUT: Atualiza um guia existente
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const updatedGuide = await prisma.guide.update({
      where: { id: data.id },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        description: data.description,
        languages: data.languages,
      },
    });
    return NextResponse.json(updatedGuide);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar guia." },
      { status: 500 }
    );
  }
}

// DELETE: Remove um guia
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.guide.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Guia removido com sucesso." });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao remover guia." },
      { status: 500 }
    );
  }
}
