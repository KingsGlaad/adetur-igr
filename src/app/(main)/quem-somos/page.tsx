"use client";

import { Target, ArrowRight } from "lucide-react";
import {
  municipalities,
  governanceStructure,
  odsGoals,
} from "@/data/site-data";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Quem Somos</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Conheça a história e a estrutura da ADETUR - Associação de
          Desenvolvimento do Turismo
        </p>
      </div>

      {/* Timeline Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Nossa História</h2>
        <div className="space-y-8">
          <div className="relative pl-8 border-l-2 border-primary">
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
            <h3 className="text-xl font-semibold">2001 - Fundação</h3>
            <p className="text-muted-foreground">
              A ADETUR foi fundada com o objetivo de promover o desenvolvimento
              turístico da região.
            </p>
          </div>
          <div className="relative pl-8 border-l-2 border-primary">
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
            <h3 className="text-xl font-semibold">2005 - Primeira Expansão</h3>
            <p className="text-muted-foreground">
              Inclusão dos primeiros municípios associados e início das
              atividades de capacitação.
            </p>
          </div>
          <div className="relative pl-8 border-l-2 border-primary">
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
            <h3 className="text-xl font-semibold">2010 - Consolidação</h3>
            <p className="text-muted-foreground">
              Implementação do sistema de governança regional e fortalecimento
              da marca turística.
            </p>
          </div>
          <div className="relative pl-8 border-l-2 border-primary">
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
            <h3 className="text-xl font-semibold">2020 - Atualidade</h3>
            <p className="text-muted-foreground">
              Expansão para 7 municípios e desenvolvimento de projetos
              inovadores em turismo.
            </p>
          </div>
        </div>
      </section>

      {/* Municipalities Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Municípios Integrados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {municipalities.map((municipality) => (
            <div
              key={municipality.name}
              className="bg-card p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2">
                {municipality.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {municipality.description}
              </p>
              <Link
                href={`/municipios/${municipality.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="text-primary hover:underline inline-flex items-center gap-2"
              >
                Conhecer mais <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Governance Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Estrutura de Governança</h2>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="space-y-6">
            {governanceStructure.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <Target className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
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
