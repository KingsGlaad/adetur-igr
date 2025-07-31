// src/app/api/highlights/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST: Cria um novo destaque turístico.
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newHighlight = await prisma.highlight.create({
      data: {
        title: data.title,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        municipalityId: data.municipalityId,
      },
    });
    return NextResponse.json(newHighlight, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar destaque:", error);
    return NextResponse.json(
      { error: "Erro ao criar destaque." },
      { status: 500 }
    );
  }
}

/**
 * PUT: Atualiza um destaque turístico existente.
 */
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const updatedHighlight = await prisma.highlight.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
    return NextResponse.json(updatedHighlight);
  } catch (error) {
    console.error("Erro ao atualizar destaque:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar destaque." },
      { status: 500 }
    );
  }
}
