import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CoordinateInput } from "./CoordinateInput";
import { ImageGallery } from "./ImageGallery";
import { Highlight } from "@/types/highligth";

interface HighlightFormProps {
  formData: Partial<Highlight>;
  onChange: (data: Partial<Highlight>) => void;
  validationErrors: { [key: string]: string };
  images?: string[];
  onImageAdd?: (files: FileList) => void;
  onImageRemove?: (url: string) => void;
  uploadProgress?: number;
  showImageGallery?: boolean;
  className?: string;
}

export function HighlightForm({
  formData,
  onChange,
  validationErrors,
  images = [],
  onImageAdd,
  onImageRemove,
  uploadProgress,
  showImageGallery = true,
  className = "",
}: HighlightFormProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label className={validationErrors.title ? "text-red-500" : ""}>
          Título *
        </Label>
        <Input
          value={formData.title || ""}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          placeholder="Nome do destaque turístico"
          className={validationErrors.title ? "border-red-500" : ""}
        />
        {validationErrors.title && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
        )}
      </div>

      <div>
        <Label className={validationErrors.description ? "text-red-500" : ""}>
          Descrição
        </Label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) =>
            onChange({ ...formData, description: e.target.value })
          }
          placeholder="Descreva o destaque turístico..."
          className={validationErrors.description ? "border-red-500" : ""}
          rows={3}
        />
        {validationErrors.description && (
          <p className="text-red-500 text-sm mt-1">
            {validationErrors.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CoordinateInput
          label="Latitude *"
          value={formData.latitude}
          onChange={(value) => onChange({ ...formData, latitude: value })}
          placeholder="-21.3456"
          error={validationErrors.latitude}
        />
        <CoordinateInput
          label="Longitude *"
          value={formData.longitude}
          onChange={(value) => onChange({ ...formData, longitude: value })}
          placeholder="-47.1234"
          error={validationErrors.longitude}
        />
      </div>

      {showImageGallery && onImageAdd && onImageRemove && (
        <ImageGallery
          highlightId={formData.id || "new"}
          images={images}
          onAdd={onImageAdd}
          onRemove={onImageRemove}
          uploadProgress={uploadProgress}
        />
      )}
    </div>
  );
}
