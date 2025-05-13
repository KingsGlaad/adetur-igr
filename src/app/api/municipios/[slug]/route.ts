import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const data = await req.json();
  const slug = (await params).slug;

  const municipio = await prisma.municipality.update({
    where: { slug },
    data: {
      name: data.name,
      description: data.description,
      about: data.about,
      latitude: data.latitude,
      longitude: data.longitude,
      coatOfArms: data.coatOfArms,
    },
  });

  return NextResponse.json(municipio);
}
