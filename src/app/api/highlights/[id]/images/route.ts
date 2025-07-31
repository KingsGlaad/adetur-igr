// src/app/api/highlights/[id]/images/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

const BUCKET_NAME = "adetur-bucket";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const highlightId = (await params).id;
  const highlight = await prisma.highlight.findUnique({
    where: { id: highlightId },
  });
  if (!highlight) {
    return NextResponse.json(
      { error: "Destaque não encontrado." },
      { status: 404 }
    );
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  // Processa todos os uploads em paralelo
  const uploadResults = await Promise.all(
    files.map(async (file) => {
      const filePath = `highlights/${highlight.id}/${Date.now()}-${file.name}`;

      // 1. Faz o upload para o Supabase
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. Obtém a URL pública
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      // 3. CRIA O REGISTO NA BASE DE DADOS - O PASSO MAIS IMPORTANTE!
      return prisma.highlightImage.create({
        data: {
          highlightId: highlight.id,
          url: publicUrlData.publicUrl,
        },
      });
    })
  );

  return NextResponse.json(uploadResults, { status: 201 });
}
