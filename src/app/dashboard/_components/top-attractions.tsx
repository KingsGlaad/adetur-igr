import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopAttractionsProps {
  attractions: {
    id: string;
    name: string;
    description: string;
    image: string | null;
  }[];
}

export function TopAttractions({ attractions }: TopAttractionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atrações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {attractions.map((attraction) => (
            <div key={attraction.id} className="flex items-center gap-4">
              {attraction.image && (
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{attraction.name}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {attraction.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
