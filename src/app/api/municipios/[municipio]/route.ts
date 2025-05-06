import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const municipality = await prisma.municipality.findUnique({
    where: { id }, // <- agora busca pelo ID
    include: {
      highlights: true,
    },
  });

  if (!municipality) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(municipality);
}
