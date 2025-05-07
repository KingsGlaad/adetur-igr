import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardStats } from "./_components/dashboard-stats";
import { prisma } from "@/lib/prisma";
import { Building2, Calendar, MapPin, Users } from "lucide-react";
import { MunicipalityList } from "./_components/municipality-list";
import { RecentEvents } from "./_components/recent-events";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const [municipalities, events, attractions, guides] = await Promise.all([
    prisma.municipality.findMany({
      include: {
        users: true,
        attractions: true,
        events: true,
        guides: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.event.findMany({
      orderBy: {
        date: "desc",
      },
      take: 5,
    }),
    prisma.attraction.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
    prisma.guide.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);
  const stats = [
    {
      title: "Municípios",
      value: municipalities.length,
      icon: Building2,
      description: "Total de municípios cadastrados",
    },
    {
      title: "Eventos",
      value: events.length,
      icon: Calendar,
      description: "Eventos programados",
    },
    {
      title: "Atrações",
      value: attractions.length,
      icon: MapPin,
      description: "Pontos turísticos cadastrados",
    },
    {
      title: "Guias",
      value: guides.length,
      icon: Users,
      description: "Guias turísticos cadastrados",
    },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <DashboardStats key={stat.title} {...stat} />
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Saiba mais</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <MunicipalityList municipalities={municipalities} />
          <RecentEvents events={events} />
        </div>
      </div>
    </div>
  );
}
