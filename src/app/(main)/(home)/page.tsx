"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
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
import {
  heroImages,
  features,
  stats,
  municipalities,
  tourismSegments,
  odsGoals,
} from "@/data/site-data";
import Image from "next/image";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HomePage() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index} className="relative">
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        {image.title}
                      </h1>
                      <p className="text-lg sm:text-xl md:text-2xl">
                        {image.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  current === index ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Ir para o slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
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
          <h2 className="text-3xl font-bold text-center mb-8 ">
            Municípios Integrados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {municipalities.map((municipality, index) => (
              <div
                key={index}
                className="rounded-lg shadow-md overflow-hidden bg-neutral-800"
              >
                <div className="relative h-48">
                  <Image
                    src={municipality.image.src}
                    alt={municipality.name}
                    width={municipality.image.width}
                    height={municipality.image.height}
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 ">
                    {municipality.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {municipality.description}
                  </p>
                  <div className="text-sm font-medium">
                    {municipality.highlight.slice(0, 2).map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded-full text-xs"
                      >
                        {item}
                      </span>
                    ))}
                    {municipality.highlight.length > 2 && (
                      <span className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded-full text-xs">
                        +{municipality.highlight.length - 2} mais
                      </span>
                    )}
                  </div>
                </div>
              </div>
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
