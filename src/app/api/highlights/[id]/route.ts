// src/app/api/highlights/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const BUCKET_NAME = "adetur-bucket";

/**
 * GET: Busca todos os destaques de um município específico, incluindo as suas galerias.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const municipalityId = (await params).id;
  try {
    const highlights = await prisma.highlight.findMany({
      where: { municipalityId },
      // FIXO: Adicionado o 'include' para garantir que a galeria de imagens seja sempre retornada
      include: {
        galleryImages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    });
    return NextResponse.json(highlights);
  } catch (error) {
    console.error("Erro ao buscar destaques:", error);
    return NextResponse.json(
      { error: "Erro ao buscar destaques." },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove um destaque e a sua pasta de imagens no bucket.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const highlightId = (await params).id;
  try {
    const { data: files } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`highlights/${highlightId}`);

    if (files && files.length > 0) {
      const filePaths = files.map(
        (file) => `highlights/${highlightId}/${file.name}`
      );
      await supabase.storage.from(BUCKET_NAME).remove(filePaths);
    }

    await prisma.highlight.delete({ where: { id: highlightId } });

    return NextResponse.json({ message: "Destaque removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover destaque:", error);
    return NextResponse.json(
      { error: "Erro ao remover destaque." },
      { status: 500 }
    );
  }
}
