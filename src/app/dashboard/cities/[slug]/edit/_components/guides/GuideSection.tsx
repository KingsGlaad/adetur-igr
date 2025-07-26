"use client";

import { useState } from "react";
import { Guide } from "@/generated";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useGuides } from "../../_hooks/useGuides";
import { GuideForm, GuideFormValues } from "./GuideForm";
import { GuideCard } from "./GuideCard";
import { DeleteGuideDialog } from "./DeleteGuideDialog";

interface GuidesSectionProps {
  municipalityId: string;
}

export function GuidesSection({ municipalityId }: GuidesSectionProps) {
  const { guides, isLoading, isSubmitting, processGuideData, deleteGuide } =
    useGuides(municipalityId);

  // Estados para controlar os diálogos e o item selecionado
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const handleOpenForm = (guide: Guide | null) => {
    setSelectedGuide(guide);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (guide: Guide) => {
    setSelectedGuide(guide);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGuide) return;
    try {
      await deleteGuide(selectedGuide.id);
      setIsDeleteOpen(false);
    } catch (error) {
      // O erro já é tratado no hook, não é necessário um toast aqui.
    }
  };

  const handleSubmit = async (
    data: GuideFormValues,
    imageFile: File | null
  ) => {
    try {
      await processGuideData(data, imageFile, selectedGuide);
      setIsFormOpen(false); // Fecha o diálogo em caso de sucesso
    } catch (error) {
      // O erro já é tratado no hook.
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Guias Turísticos</h3>
        <Button type="button" onClick={() => handleOpenForm(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Guia
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>A carregar guias...</span>
        </div>
      ) : guides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onEdit={() => handleOpenForm(guide)}
              onDelete={() => handleOpenDeleteDialog(guide)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhum guia registado para este município.
        </p>
      )}

      {/* Diálogo para Criar/Editar Guia */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedGuide ? "Editar Guia" : "Adicionar Novo Guia"}
            </DialogTitle>
          </DialogHeader>
          <GuideForm
            guide={selectedGuide!}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para Confirmar Exclusão */}
      <DeleteGuideDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
