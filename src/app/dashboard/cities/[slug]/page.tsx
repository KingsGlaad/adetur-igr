import Image from "next/image";
import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import MunicipioMap from "@/app/(main)/municipios/[slug]/_components/MunicipioMap";

export default async function MunicipioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const municipality = await prisma.municipality.findUnique({
    where: {
      slug,
    },
    include: {
      highlights: true,
    },
  });

  if (!municipality) {
    return <div className="text-white">Município não encontrado</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* GALERIA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-8">
        <div className="relative col-span-1 md:col-span-2 h-full">
          <Image
            src={municipality.coatOfArms || "/placeholder.jpg"}
            alt={municipality.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {municipality.name}
          </h1>
          <p className="text-neutral-400 text-lg mb-4">
            {municipality.description}
          </p>
          {municipality.about && (
            <div className="prose prose-invert text-neutral-400 text-sm mb-6 max-w-none">
              <div dangerouslySetInnerHTML={{ __html: municipality.about }} />
            </div>
          )}

          {municipality.highlights.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Destaques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {municipality.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-800 border border-neutral-700 rounded-lg p-5 hover:border-neutral-500 transition-colors shadow hover:shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {highlight.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Localização
            </h2>
            <div className="relative h-96 w-full rounded-lg overflow-hidden border border-neutral-700 shadow z-0">
              <MunicipioMap municipality={municipality} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-neutral-900 border border-neutral-700 rounded-lg p-6 shadow">
            <h3 className="text-xl font-semibold text-white mb-4">
              Informações rápidas
            </h3>
            <p className="text-neutral-400 text-sm">
              Aqui pode entrar um resumo, links úteis ou outras informações!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
