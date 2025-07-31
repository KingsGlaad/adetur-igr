// src/app/cities/[slug]/edit/_components/highlights/EditHighlightDialog.tsx

import { useEffect, useState } from "react";
import { HighlightWithImages } from "../../_hooks/useHighlights";
import { HighlightForm, HighlightFormValues } from "./HighlightForm";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageGallery } from "./ImageGallery";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditHighlightDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  highlight: HighlightWithImages | null;
  onUpdate: (data: HighlightFormValues, files: File[]) => Promise<void>;
  onImageRemove: (imageId: string) => void;
  isUpdating: boolean;
}

export function EditHighlightDialog({
  open,
  onOpenChange,
  highlight,
  onUpdate,
  onImageRemove,
  isUpdating,
}: EditHighlightDialogProps) {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setNewFiles([]);
      setPreviews([]);
    }
  }, [open]);

  useEffect(() => {
    const objectUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [newFiles]);

  const handleFormSubmit = async (data: HighlightFormValues) => {
    await onUpdate(data, newFiles);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Destaque</DialogTitle>
        </DialogHeader>
        <HighlightForm highlight={highlight} onSubmit={handleFormSubmit}>
          <ImageGallery
            existingImages={highlight?.galleryImages || []}
            newImagePreviews={previews}
            onAddImages={(addedFiles) =>
              setNewFiles((prev) => [...prev, ...addedFiles])
            }
            onRemoveNewImage={(index) =>
              setNewFiles((prev) => prev.filter((_, i) => i !== index))
            }
            onRemoveExistingImage={onImageRemove}
            isUploading={isUpdating}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </HighlightForm>
      </DialogContent>
    </Dialog>
  );
}
