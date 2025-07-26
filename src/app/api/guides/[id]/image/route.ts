import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import path from "path";

const BUCKET_NAME = "adetur-bucket";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guideId = (await params).id;
    const guide = await prisma.guide.findUnique({ where: { id: guideId } });

    if (!guide) {
      return NextResponse.json(
        { error: "Guia não encontrado." },
        { status: 404 }
      );
    }

    // Remove a imagem antiga, se existir
    if (guide.image) {
      const urlParts = guide.image.split(
        `/storage/v1/object/public/${BUCKET_NAME}/`
      );
      if (urlParts[1])
        await supabase.storage.from(BUCKET_NAME).remove([urlParts[1]]);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    const sanitizedName = guide.name.toLowerCase().replace(/\s+/g, "-");
    const filePath = `cities/${
      guide.municipalityId
    }/guides/${guideId}/${sanitizedName}${path.extname(file.name)}`;

    await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, { upsert: true });

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const updatedGuide = await prisma.guide.update({
      where: { id: guideId },
      data: { image: publicUrlData.publicUrl },
    });

    return NextResponse.json(updatedGuide);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro no upload da imagem do guia." },
      { status: 500 }
    );
  }
}
