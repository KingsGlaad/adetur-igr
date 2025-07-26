"use client";

import { X, ImageIcon, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EventImage } from "@/generated";
import { filterAndValidateImages } from "@/lib/image-validator";

interface EventImageGalleryProps {
  images: EventImage[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (imageId: string) => void;
  isUploading: boolean;
}

export function EventImageGallery({
  images,
  onAddImages,
  onRemoveImage,
  isUploading,
}: EventImageGalleryProps) {
  const imageList = Array.isArray(images) ? images : [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = filterAndValidateImages(e.target.files);
      if (validFiles.length > 0) {
        onAddImages(validFiles);
      }
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <Label>Galeria de Imagens do Evento</Label>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {imageList.map((image) => (
          <div key={image.id} className="relative aspect-square group">
            <img
              src={image.url}
              alt="Imagem da galeria do evento"
              className="w-full h-full object-cover rounded-md border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
              onClick={() => onRemoveImage(image.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Label
          htmlFor="event-gallery-input"
          className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-accent"
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <ImageIcon className="h-8 w-8" />
          )}
        </Label>
        <input
          id="event-gallery-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
