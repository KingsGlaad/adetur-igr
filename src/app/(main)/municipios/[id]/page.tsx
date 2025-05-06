import Image from "next/image";
import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import MunicipioMap from "./_components/MunicipioMap";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function MunicipioPage({ params }: PageProps) {
  const { id } = await params;
  const municipality = await prisma.municipality.findUnique({
    where: {
      id: id,
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
        {/* Exemplo: mais imagens se quiser expandir a galeria no futuro */}
        {/* <div className="relative h-48">
      <Image src="/some-other.jpg" alt="..." fill className="object-cover" />
    </div> */}
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUNA PRINCIPAL */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {municipality.name}
          </h1>
          <p className="text-neutral-400 text-lg mb-4">
            {municipality.description}
          </p>
          {municipality.about && (
            <p className="text-neutral-400 text-sm mb-6">
              {municipality.about}
            </p>
          )}

          {/* Destaques */}
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
                    <p className="text-sm text-neutral-400">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mapa */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Localização
            </h2>
            <div className="relative h-96 w-full rounded-lg overflow-hidden border border-neutral-700 shadow z-0">
              <MunicipioMap municipality={municipality} />
            </div>
          </div>
        </div>

        {/* COLUNA SECUNDÁRIA (EX: pode usar para algo útil no futuro) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-neutral-900 border border-neutral-700 rounded-lg p-6 shadow">
            <h3 className="text-xl font-semibold text-white mb-4">
              Informações rápidas
            </h3>
            {/* Aqui você pode colocar mais conteúdo, ou deixar vazio por enquanto */}
            <p className="text-neutral-400 text-sm">
              Aqui pode entrar um resumo, links úteis ou outras informações!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
