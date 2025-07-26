import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Edit2,
  Trash2,
  MapPin,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Highlight } from "@/types/highligth";

interface HighlightCardProps {
  highlight: Highlight;
  images: string[];
  onEdit: () => void;
  onDelete: () => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function HighlightCard({
  highlight,
  images,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: HighlightCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">
              {highlight.title}
            </CardTitle>
            {highlight.description && (
              <CardDescription className="line-clamp-2 mt-1">
                {highlight.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {highlight.latitude && highlight.longitude && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} />
            <span>
              {highlight.latitude.toFixed(6)}, {highlight.longitude.toFixed(6)}
            </span>
          </div>
        )}

        {images.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={14} />
              <Badge variant="secondary" className="text-xs">
                {images.length} imagem(ns)
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {images.slice(0, 3).map((url, index) => (
                <div
                  key={index}
                  className="aspect-square relative overflow-hidden rounded"
                >
                  <img
                    src={url}
                    alt={`${highlight.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {index === 2 && images.length > 3 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        +{images.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          disabled={isUpdating || isDeleting}
        >
          {isUpdating ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <Edit2 className="mr-2 h-3 w-3" />
          )}
          Editar
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isUpdating || isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-3 w-3" />
          )}
          Remover
        </Button>
      </CardFooter>
    </Card>
  );
}
