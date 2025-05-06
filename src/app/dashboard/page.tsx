import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Calendar, MapPin, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DashboardStats } from "./_components/dashboard-stats";
import { RecentEvents } from "./_components/recent-events";
import { TopAttractions } from "./_components/top-attractions";
import { MunicipalityList } from "./_components/municipality-list";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
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
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStats key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Tabs defaultValue="municipalities">
            <TabsList>
              <TabsTrigger value="municipalities">Municípios</TabsTrigger>
              <TabsTrigger value="attractions">Atrações</TabsTrigger>
              <TabsTrigger value="guides">Guias</TabsTrigger>
            </TabsList>
            <TabsContent value="municipalities">
              <MunicipalityList municipalities={municipalities} />
            </TabsContent>
            <TabsContent value="attractions">
              <TopAttractions attractions={attractions} />
            </TabsContent>
            <TabsContent value="guides">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold">Guias Recentes</h3>
                <div className="mt-4 space-y-4">
                  {guides.map((guide) => (
                    <div
                      key={guide.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{guide.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {guide.phone}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {guide.languages.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="col-span-3 mt-12">
          <RecentEvents events={events} />
        </div>
      </div>
    </div>
  );
}
