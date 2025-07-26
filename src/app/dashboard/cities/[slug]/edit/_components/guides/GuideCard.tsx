import { Guide } from "@/generated";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Phone, Mail, Languages } from "lucide-react";

interface GuideCardProps {
  guide: Guide;
  onEdit: () => void;
  onDelete: () => void;
}

export function GuideCard({ guide, onEdit, onDelete }: GuideCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 flex flex-col items-center text-center bg-slate-50">
        <Image
          src={guide.image || "/images/default-user.png"}
          alt={`Foto de ${guide.name}`}
          width={80}
          height={80}
          className="rounded-full object-cover border-2 border-white shadow-lg"
        />
        <h3 className="mt-3 font-semibold text-lg text-slate-800">
          {guide.name}
        </h3>
        {guide.description && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
            {guide.description}
          </p>
        )}
      </div>
      <div className="p-4 space-y-2 text-sm border-t">
        <div className="flex items-center gap-2 text-slate-600">
          <Phone className="h-4 w-4 text-slate-400" />
          <span>{guide.phone}</span>
        </div>
        {guide.email && (
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="h-4 w-4 text-slate-400" />
            <span>{guide.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-slate-600">
          <Languages className="h-4 w-4 text-slate-400" />
          <span>{guide.languages.join(", ")}</span>
        </div>
      </div>
      <div className="p-2 flex justify-end gap-2 bg-slate-50 border-t">
        <Button type="button" variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-3 w-3" />
          Editar
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-3 w-3" />
          Remover
        </Button>
      </div>
    </div>
  );
}
