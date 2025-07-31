// src/app/cities/[slug]/edit/_components/highlights/HighlightCard.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HighlightWithImages } from "../../_hooks/useHighlights";
import { Edit2, Trash2, MapPin, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HighlightCardProps {
  highlight: HighlightWithImages;
  onEdit: () => void;
  onDelete: () => void;
}

export function HighlightCard({
  highlight,
  onEdit,
  onDelete,
}: HighlightCardProps) {
  // Garante que `galleryImages` é sempre um array e obtém a primeira imagem.
  const galleryImages = Array.isArray(highlight.galleryImages)
    ? highlight.galleryImages
    : [];
  const coverImage = galleryImages[0]?.url || "/images/no-image.jpeg";

  return (
    <Card className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative w-full aspect-[16/10]">
        <Image
          src={coverImage}
          alt={`Imagem de ${highlight.title}`}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <CardTitle className="text-lg">{highlight.title}</CardTitle>
        <CardDescription className="mt-1 text-sm line-clamp-2 h-10">
          {highlight.description}
        </CardDescription>

        <div className="flex-grow mt-4 space-y-2">
          {highlight.latitude && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>Coordenadas Definidas</span>
            </div>
          )}
          {galleryImages.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ImageIcon className="h-3 w-3" />
              <span>{galleryImages.length} imagem(ns)</span>
            </div>
          )}
        </div>
      </div>

      <CardFooter className="flex justify-end gap-2 bg-slate-50 p-2 border-t">
        <Button type="button" variant="outline" size="sm" onClick={onEdit}>
          <Edit2 className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remover
        </Button>
      </CardFooter>
    </Card>
  );
}
