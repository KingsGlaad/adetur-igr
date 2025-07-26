import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

const BUCKET_NAME = "adetur-bucket"; // Centralize o nome do seu bucket

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const highlightId = (await params).id;

  if (!highlightId) {
    return NextResponse.json(
      { error: "ID do destaque é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`highlights/${highlightId}`);

    if (error) {
      console.error("Erro ao listar imagens no Supabase:", error);
      throw new Error("Não foi possível buscar as imagens.");
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ urls: [] });
    }

    const urls = data.map((file) => {
      return supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`highlights/${highlightId}/${file.name}`).data.publicUrl;
    });

    return NextResponse.json({ urls });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno no servidor";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const highlightId = (await params).id;
  if (!highlightId) {
    return NextResponse.json(
      { error: "ID do destaque é obrigatório" },
      { status: 400 }
    );
  }

  const highlight = await prisma.highlight.findUnique({
    where: { id: highlightId },
  });
  if (!highlight) {
    return NextResponse.json(
      { error: "Destaque não encontrado" },
      { status: 404 }
    );
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo para upload" },
        { status: 400 }
      );
    }

    const uploadPromises = files.map((file) => {
      const sanitizedFileName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-.]/g, "");

      const filePath = `highlights/${highlightId}/${Date.now()}-${sanitizedFileName}`;

      return supabase.storage.from(BUCKET_NAME).upload(filePath, file);
    });

    const results = await Promise.all(uploadPromises);

    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      console.error("Erros no upload para o Supabase:", errors);
      return NextResponse.json(
        { error: "Falha ao fazer upload de um ou mais arquivos." },
        { status: 500 }
      );
    }

    const successfulUploads = results.map((result) => result.data);
    const urls = successfulUploads.map((upload) => {
      return supabase.storage.from(BUCKET_NAME).getPublicUrl(upload!.path).data
        .publicUrl;
    });

    return NextResponse.json(
      {
        message: "Upload concluído com sucesso!",
        urls: urls,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao processar o upload." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const highlightId = (await params).id;
  if (!highlightId) {
    return NextResponse.json(
      { error: "ID do destaque é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL da imagem é obrigatória." },
        { status: 400 }
      );
    }

    const urlParts = url.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
    const filePath = urlParts[1];

    if (!filePath) {
      return NextResponse.json(
        { error: "URL da imagem inválida." },
        { status: 400 }
      );
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error("Erro ao remover imagem do Supabase:", error);
      return NextResponse.json(
        { error: "Não foi possível remover a imagem." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Imagem removida com sucesso!" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao processar a requisição." },
      { status: 500 }
    );
  }
}
