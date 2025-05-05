import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentEventsProps {
  events: {
    id: string;
    title: string;
    description: string;
    date: Date;
    image: string | null;
  }[];
}

export function RecentEvents({ events }: RecentEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Eventos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-4">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(event.date, "PPP", { locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
