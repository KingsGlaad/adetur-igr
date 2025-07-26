import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// ... (outras importações)
import { Highlight } from "@/types/highligth";
import { Loader2 } from "lucide-react";
import { HighlightForm } from "./HighlightForm";

// FIX: As props foram atualizadas para controlar o diálogo externamente
interface CreateHighlightDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreate: (highlight: Partial<Highlight>, images: File[]) => Promise<void>;
  isCreating: boolean;
}

export function CreateHighlightDialog({
  open,
  onOpenChange,
  onCreate,
  isCreating,
}: CreateHighlightDialogProps) {
  const [formData, setFormData] = useState<Partial<Highlight>>({});
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const newUrls = filesToUpload.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newUrls);
    return () => newUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [filesToUpload]);

  useEffect(() => {
    if (!open) {
      setFormData({});
      setFilesToUpload([]);
      setPreviewUrls([]);
      setValidationErrors({});
    }
  }, [open]);

  const handleImageAdd = (newFiles: FileList) => {
    setFilesToUpload((prevFiles) => [...prevFiles, ...Array.from(newFiles)]);
  };

  const handleImageRemove = (urlToRemove: string) => {
    const indexToRemove = previewUrls.indexOf(urlToRemove);
    if (indexToRemove > -1) {
      setFilesToUpload((prevFiles) =>
        prevFiles.filter((_, i) => i !== indexToRemove)
      );
    }
  };

  const handleSubmit = async () => {
    try {
      await onCreate(formData, filesToUpload);
      onOpenChange(false);
    } catch (error) {
      console.error("Falha ao criar destaque:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Destaque</DialogTitle>
        </DialogHeader>
        <HighlightForm
          formData={formData}
          onChange={setFormData}
          validationErrors={validationErrors}
          images={previewUrls}
          onImageAdd={handleImageAdd}
          onImageRemove={handleImageRemove}
          showImageGallery={true}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Destaque
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
