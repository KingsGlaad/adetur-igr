import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ajuste o path se for diferente

export async function GET() {
  try {
    const municipalities = await prisma.municipality.findMany({
      include: {
        highlights: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(municipalities);
  } catch (error) {
    console.error("Erro ao buscar municípios:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
