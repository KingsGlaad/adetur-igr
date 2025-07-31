// src/app/cities/[slug]/edit/_components/MunicipalityHighlights.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

import { useHighlights, HighlightWithImages } from "../_hooks/useHighlights";
import { CreateHighlightDialog } from "./highlights/CreateHighlightDialog";
import { EditHighlightDialog } from "./highlights/EditHighlightDialog";
import { DeleteHighlightDialog } from "./highlights/DeleteHighlightDialog";
import { HighlightCard } from "./highlights/HighlightCard";
import { HighlightFormValues } from "./highlights/HighlightForm";

interface MunicipalityHighlightsProps {
  municipalityId: string;
}

export function MunicipalityHighlights({
  municipalityId,
}: MunicipalityHighlightsProps) {
  // FIX: Corrigido para desestruturar todas as funções necessárias do hook
  const {
    highlights,
    isLoading,
    isSubmitting,
    processHighlightData, // Adicionada a função que faltava
    deleteHighlight,
    removeHighlightImage, // Corrigido o nome da função (era removeImage)
  } = useHighlights(municipalityId);

  // Estados para controlar os diálogos
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedHighlight, setSelectedHighlight] =
    useState<HighlightWithImages | null>(null);

  const handleOpenEdit = (highlight: HighlightWithImages) => {
    setSelectedHighlight(highlight);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (highlight: HighlightWithImages) => {
    setSelectedHighlight(highlight);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedHighlight) return;
    await deleteHighlight(selectedHighlight.id);
    setIsDeleteOpen(false);
  };

  // FIX: Esta função agora chama corretamente a `processHighlightData` do hook
  const handleCreate = async (data: HighlightFormValues, files: File[]) => {
    await processHighlightData(data, files, null);
    setIsCreateOpen(false);
  };

  // FIX: Esta função agora chama corretamente a `processHighlightData` do hook
  const handleUpdate = async (data: HighlightFormValues, files: File[]) => {
    if (!selectedHighlight) return;
    await processHighlightData(data, files, selectedHighlight);
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Destaques Turísticos</h3>
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Destaque
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>A carregar destaques...</span>
        </div>
      ) : Array.isArray(highlights) && highlights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight) => (
            <HighlightCard
              key={highlight.id}
              highlight={highlight}
              onEdit={() => handleOpenEdit(highlight)}
              onDelete={() => handleOpenDelete(highlight)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhum destaque registado.
        </p>
      )}

      {/* Diálogos */}
      <CreateHighlightDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={handleCreate}
        isCreating={isSubmitting}
      />

      <EditHighlightDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        highlight={selectedHighlight}
        onUpdate={handleUpdate}
        // FIX: Passa a função com o nome correto para o diálogo de edição
        onImageRemove={removeHighlightImage}
        isUpdating={isSubmitting}
      />

      <DeleteHighlightDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
