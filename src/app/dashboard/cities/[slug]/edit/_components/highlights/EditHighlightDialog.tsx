import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { HighlightForm } from "./HighlightForm";
import { Highlight, DialogStates, highlightSchema } from "@/types/highligth";
import { z } from "zod";

interface EditHighlightDialogProps {
  dialogState: DialogStates["edit"];
  onClose: () => void;
  onUpdate: (highlight: Partial<Highlight>, newFiles: File[]) => Promise<void>;
  onImageRemove: (highlightId: string, imageUrl: string) => Promise<void>;
  images: string[];
  isUpdating: boolean;
}

export function EditHighlightDialog({
  dialogState,
  onClose,
  onUpdate,
  onImageRemove: onExistingImageRemove,
  images,
  isUpdating,
}: EditHighlightDialogProps) {
  const [formData, setFormData] = useState<Partial<Highlight>>({});
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (dialogState.open && dialogState.highlight) {
      setFormData(dialogState.highlight);
      setNewFiles([]);
      setPreviewUrls([]);
      setValidationErrors({});
    }
  }, [dialogState.open, dialogState.highlight]);

  useEffect(() => {
    const objectUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newFiles]);

  const handleImageAdd = (addedFiles: FileList) => {
    setNewFiles((prevFiles) => [...prevFiles, ...Array.from(addedFiles)]);
  };

  const handleImageRemove = (urlToRemove: string) => {
    const previewIndex = previewUrls.indexOf(urlToRemove);
    if (previewIndex > -1) {
      setNewFiles((prevFiles) =>
        prevFiles.filter((_, i) => i !== previewIndex)
      );
    } else {
      if (dialogState.highlight?.id) {
        onExistingImageRemove(dialogState.highlight.id, urlToRemove);
      }
    }
  };

  const handleSubmit = async () => {
    // Validação do Zod
    const result = highlightSchema.safeParse(formData);
    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }
    setValidationErrors({});

    try {
      await onUpdate(formData, newFiles);
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar o destaque.");
      console.error("Erro ao atualizar destaque:", error);
    }
  };

  return (
    <Dialog open={dialogState.open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Destaque</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <HighlightForm
            formData={formData}
            onChange={setFormData}
            validationErrors={validationErrors}
            images={[...images, ...previewUrls]}
            onImageAdd={handleImageAdd}
            onImageRemove={handleImageRemove}
            showImageGallery={true}
          />
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
