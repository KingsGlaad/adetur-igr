// src/app/api/highlights/images/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

const BUCKET_NAME = "adetur-bucket";

// DELETE: Remove uma imagem específica da galeria de um destaque.
export async function DELETE(req: NextRequest) {
  try {
    const { imageId } = await req.json();
    if (!imageId) {
      return NextResponse.json(
        { error: "ID da imagem é obrigatório." },
        { status: 400 }
      );
    }

    const image = await prisma.highlightImage.findUnique({
      where: { id: imageId },
    });

    if (image) {
      // Remove do Supabase
      const urlParts = image.url.split(
        `/storage/v1/object/public/${BUCKET_NAME}/`
      );
      if (urlParts[1]) {
        await supabase.storage.from(BUCKET_NAME).remove([urlParts[1]]);
      }
      // Remove da base de dados
      await prisma.highlightImage.delete({ where: { id: imageId } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover imagem:", error);
    return NextResponse.json(
      { error: "Erro ao remover imagem." },
      { status: 500 }
    );
  }
}
