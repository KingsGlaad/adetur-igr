"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { DialogStates, Highlight } from "@/types/highligth";
import { useHighlights } from "@/hooks/useHighlights";

import { HighlightCard } from "./highlights/HighlightCard";
import { CreateHighlightDialog } from "./highlights/CreateHighlightDialog";
import { EditHighlightDialog } from "./highlights/EditHighlightDialog";
import { DeleteHighlightDialog } from "./highlights/DeleteHighlightDialog";
import { Button } from "@/components/ui/button";

interface MunicipalityHighlightsProps {
  municipalityId: string;
}

export function MunicipalityHighlights({
  municipalityId,
}: MunicipalityHighlightsProps) {
  const {
    highlights,
    images,
    isLoading,
    isSubmitting,
    createHighlight,
    updateHighlight,
    deleteHighlight,
    removeImage,
    uploadImages,
  } = useHighlights(municipalityId);

  const [dialogs, setDialogs] = useState<DialogStates>({
    create: { open: false },
    edit: { open: false, highlight: null },
    delete: { open: false, highlightId: null },
  });

  const handleCloseDialogs = () => {
    setDialogs({
      create: { open: false },
      edit: { open: false, highlight: null },
      delete: { open: false, highlightId: null },
    });
  };

  const handleConfirmDelete = async () => {
    if (dialogs.delete.highlightId) {
      await deleteHighlight(dialogs.delete.highlightId);
      handleCloseDialogs();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Destaques Turísticos</h3>

        <Button
          type="button"
          onClick={() =>
            setDialogs((prev) => ({ ...prev, create: { open: true } }))
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Destaque
        </Button>
      </div>

      {highlights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight) => (
            <HighlightCard
              key={highlight.id}
              highlight={highlight}
              images={images[highlight.id!] || []}
              onEdit={() =>
                setDialogs({ ...dialogs, edit: { open: true, highlight } })
              }
              onDelete={() =>
                setDialogs({
                  ...dialogs,
                  delete: { open: true, highlightId: highlight.id! },
                })
              }
              isUpdating={
                isSubmitting && dialogs.edit.highlight?.id === highlight.id
              }
              isDeleting={
                isSubmitting && dialogs.delete.highlightId === highlight.id
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Nenhum destaque cadastrado.</p>
        </div>
      )}

      {/* --- DIÁLOGOS --- */}
      <CreateHighlightDialog
        open={dialogs.create.open}
        onOpenChange={(isOpen: boolean) =>
          setDialogs((prev) => ({ ...prev, create: { open: isOpen } }))
        }
        onCreate={createHighlight}
        isCreating={isSubmitting}
      />

      <EditHighlightDialog
        dialogState={dialogs.edit}
        onClose={handleCloseDialogs}
        onUpdate={updateHighlight}
        onImageRemove={removeImage}
        images={
          dialogs.edit.highlight ? images[dialogs.edit.highlight.id!] || [] : []
        }
        isUpdating={isSubmitting}
      />

      <DeleteHighlightDialog
        dialogState={dialogs.delete}
        onClose={handleCloseDialogs}
        onConfirm={handleConfirmDelete}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
