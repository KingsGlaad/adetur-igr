"use client";

import { X, ImageIcon, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HighlightImage } from "@/generated";
import { filterAndValidateImages } from "@/lib/image-validator";

interface ImageGalleryProps {
  existingImages: HighlightImage[];
  newImagePreviews: string[];
  onAddImages: (files: File[]) => void;
  onRemoveNewImage: (index: number) => void;
  onRemoveExistingImage: (imageId: string) => void;
  isUploading: boolean;
}

export function ImageGallery({
  existingImages,
  newImagePreviews,
  onAddImages,
  onRemoveNewImage,
  onRemoveExistingImage,
  isUploading,
}: ImageGalleryProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = filterAndValidateImages(e.target.files);
      if (validFiles.length > 0) onAddImages(validFiles);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>Galeria de Imagens</Label>
      <div className="grid grid-cols-4 gap-2">
        {existingImages.map((image) => (
          <div key={image.id} className="relative aspect-square group">
            <img
              src={image.url}
              alt="Imagem existente"
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100"
              onClick={() => onRemoveExistingImage(image.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {newImagePreviews.map((url, index) => (
          <div key={url} className="relative aspect-square group">
            <img
              src={url}
              alt="Pré-visualização"
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100"
              onClick={() => onRemoveNewImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Label
          htmlFor="highlight-gallery-input"
          className="aspect-square border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-accent"
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </Label>
        <input
          id="highlight-gallery-input"
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
