import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILES_PER_HIGHLIGHT,
  validateFile,
} from "@/types/highligth";
import Image from "next/image";

interface ImageGalleryProps {
  highlightId: string;
  images: string[];
  onRemove: (url: string) => void;
  onAdd: (files: FileList) => void;
  uploadProgress?: number;
  className?: string;
}

export function ImageGallery({
  highlightId,
  images,
  onRemove,
  onAdd,
  uploadProgress,
  className = "",
}: ImageGalleryProps) {
  const handleFileSelect = (files: FileList) => {
    const filesArray = Array.from(files);

    if (images.length + filesArray.length > MAX_FILES_PER_HIGHLIGHT) {
      toast.error(`Máximo ${MAX_FILES_PER_HIGHLIGHT} imagens por destaque`);
      return;
    }

    // Validar arquivos
    const validFiles = filesArray.filter((file) => {
      const error = validateFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Criar novo FileList com arquivos válidos
    const dt = new DataTransfer();
    validFiles.forEach((file) => dt.items.add(file));
    onAdd(dt.files);
  };

  return (
    <div className={className}>
      <Label>
        Imagens ({images.length}/{MAX_FILES_PER_HIGHLIGHT})
      </Label>

      <div className="flex flex-wrap gap-2 my-2">
        {images.map((url, index) => (
          <div key={index} className="relative w-20 h-20 group">
            <Image
              src={url}
              width={80}
              height={80}
              alt={`Imagem ${index + 1}`}
              className="w-full h-full object-cover rounded border"
              loading="lazy"
            />
            <button
              type="button"
              className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              onClick={() => onRemove(url)}
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {images.length < MAX_FILES_PER_HIGHLIGHT && (
          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
            <label className="cursor-pointer flex items-center justify-center w-full h-full">
              <ImageIcon size={24} className="text-gray-400" />
              <input
                type="file"
                multiple
                accept={ALLOWED_FILE_TYPES.join(",")}
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleFileSelect(e.target.files)
                }
              />
            </label>
          </div>
        )}
      </div>

      {uploadProgress !== undefined && uploadProgress < 100 && (
        <div className="mt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Loader2 className="animate-spin" size={14} />
            Enviando imagens...
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <p className="text-sm text-gray-500 mt-1">
        Formatos aceitos: JPG, PNG, WebP (máximo 5MB cada)
      </p>
    </div>
  );
}
