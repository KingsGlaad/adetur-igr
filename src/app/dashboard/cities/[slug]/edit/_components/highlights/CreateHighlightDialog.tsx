import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HighlightForm, HighlightFormValues } from "./HighlightForm";
import { ImageGallery } from "./ImageGallery";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface CreateHighlightDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreate: (data: HighlightFormValues, files: File[]) => Promise<void>;
  isCreating: boolean;
}

export function CreateHighlightDialog({
  open,
  onOpenChange,
  onCreate,
  isCreating,
}: CreateHighlightDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setPreviews([]);
    }
  }, [open]);

  useEffect(() => {
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleFormSubmit = async (data: HighlightFormValues) => {
    await onCreate(data, files);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Destaque</DialogTitle>
        </DialogHeader>
        <HighlightForm onSubmit={handleFormSubmit}>
          <ImageGallery
            existingImages={[]}
            newImagePreviews={previews}
            onAddImages={(newFiles) =>
              setFiles((prev) => [...prev, ...newFiles])
            }
            onRemoveNewImage={(index) =>
              setFiles((prev) => prev.filter((_, i) => i !== index))
            }
            onRemoveExistingImage={() => {}}
            isUploading={isCreating}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Criando..." : "Criar Destaque"}
            </Button>
          </DialogFooter>
        </HighlightForm>
      </DialogContent>
    </Dialog>
  );
}
