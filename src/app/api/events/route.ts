import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lista todos os eventos de um município
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
    const events = await prisma.event.findMany({
      where: { municipalityId },
      orderBy: { date: "asc" }, // Ordena por data do evento
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar eventos." },
      { status: 500 }
    );
  }
}

// POST: Cria um novo evento
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newEvent = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date), // Converte a string de data para DateTime
        municipalityId: data.municipalityId,
      },
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar evento." },
      { status: 500 }
    );
  }
}

// PUT: Atualiza um evento existente
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const updatedEvent = await prisma.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
      },
    });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar evento." },
      { status: 500 }
    );
  }
}

// DELETE: Remove um evento
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    // Lógica para remover a imagem do Supabase antes de apagar o registo
    const event = await prisma.event.findUnique({ where: { id } });
    if (event?.image) {
      // Implementar a lógica de remoção do Supabase aqui, se necessário
    }
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: "Evento removido com sucesso." });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao remover evento." },
      { status: 500 }
    );
  }
}
