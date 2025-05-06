import {
  MapPin,
  Users,
  Calendar,
  Building2,
  Leaf,
  Mountain,
  Church,
  Fish,
  Trees,
  Globe,
} from "lucide-react";
import { features, stats, tourismSegments, odsGoals } from "@/data/site-data";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MunicipalitiesCard } from "@/components/cards/MunicipalitiesCard";
import { HeroImage } from "./_components/Hero-Image";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [municipalities] = await Promise.all([
    prisma.municipality.findMany({
      include: {
        highlights: true,
      },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full">
        <HeroImage />
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold ">{stat.title}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Nossos Diferenciais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon =
                feature.icon === "MapPin"
                  ? MapPin
                  : feature.icon === "Users"
                  ? Users
                  : feature.icon === "Calendar"
                  ? Calendar
                  : Building2;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-neutral-800 rounded-lg shadow-md"
                >
                  <div className="flex justify-center mb-4">
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Municipalities Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Municípios Integrados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {municipalities.map((municipality) => (
              <MunicipalitiesCard
                key={municipality.id}
                municipalities={municipality}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tourism Segments Section */}
      <section className="py-12 bg-neutral-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Segmentos Turísticos Atendidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tourismSegments.map((segment, index) => {
              const Icon =
                segment.name === "Turismo Rural"
                  ? Trees
                  : segment.name === "Turismo de Aventura"
                  ? Mountain
                  : segment.name === "Turismo Cultural"
                  ? Globe
                  : segment.name === "Turismo Ecológico"
                  ? Leaf
                  : segment.name === "Pesca"
                  ? Fish
                  : segment.name === "Lazer"
                  ? Calendar
                  : Church;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-neutral-700 rounded-lg shadow-md"
                >
                  <div className="flex justify-center mb-4">
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{segment.name}</h3>
                  <p className="text-gray-300">{segment.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ODS Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Objetivos de Desenvolvimento Sustentável (ODS)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <TooltipProvider>
              {odsGoals.map((goal, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div className="rounded-lg overflow-hidden p-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
                      <Image
                        src={goal.image}
                        alt={`ODS ${goal.number}`}
                        width={120}
                        height={120}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-neutral-800 text-white p-4">
                    <h3 className="font-bold mb-2 text-lg">{goal.title}</h3>
                    <p className="text-sm text-gray-300">{goal.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </section>
    </div>
  );
}
