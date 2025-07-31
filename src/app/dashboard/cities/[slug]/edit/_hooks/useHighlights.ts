import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Highlight, HighlightImage } from "@/generated";
import { HighlightFormValues } from "../_components/highlights/HighlightForm";

// Estende o tipo Highlight para incluir a sua galeria de imagens
export type HighlightWithImages = Highlight & {
  galleryImages: HighlightImage[];
};

export function useHighlights(municipalityId: string) {
  const [highlights, setHighlights] = useState<HighlightWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHighlights = useCallback(async () => {
    if (!municipalityId) return;
    setIsLoading(true);
    try {
      // A sua API GET em /api/highlights/[id] precisa de incluir a relação `galleryImages`
      const res = await axios.get(`/api/highlights/${municipalityId}`);
      setHighlights(res.data);
    } catch {
      toast.error("Erro ao carregar os destaques turísticos.");
    } finally {
      setIsLoading(false);
    }
  }, [municipalityId]);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  const processHighlightData = async (
    data: HighlightFormValues,
    files: File[],
    editingHighlight: HighlightWithImages | null
  ) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        municipalityId: editingHighlight ? undefined : municipalityId,
        id: editingHighlight?.id,
      };

      const response = editingHighlight
        ? await axios.put("/api/highlights", payload)
        : await axios.post("/api/highlights", payload);

      const highlight: Highlight = response.data;

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        await axios.post(`/api/highlights/${highlight.id}/images`, formData);
      }

      toast.success(
        `Destaque ${editingHighlight ? "atualizado" : "criado"} com sucesso!`
      );
      await fetchHighlights();
    } catch (error) {
      toast.error("Erro ao salvar o destaque.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteHighlight = async (id: string) => {
    setIsSubmitting(true);
    try {
      await axios.delete(`/api/highlights/${id}`);
      toast.success("Destaque removido com sucesso!");
      await fetchHighlights();
    } catch (error) {
      toast.error("Erro ao remover o destaque.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeHighlightImage = async (imageId: string) => {
    try {
      await axios.delete(`/api/highlights/images`, { data: { imageId } });
      toast.success("Imagem removida com sucesso!");
      await fetchHighlights();
    } catch {
      toast.error("Erro ao remover a imagem.");
    }
  };

  return {
    highlights,
    isLoading,
    isSubmitting,
    processHighlightData,
    deleteHighlight,
    removeHighlightImage,
  };
}
