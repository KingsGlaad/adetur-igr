import { useState, useEffect, useCallback } from "react";
import { Guide } from "@/generated";
import axios from "axios";
import { toast } from "sonner";
import { GuideFormValues } from "../_components/guides/GuideForm";

export function useGuides(municipalityId: string) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGuides = useCallback(async () => {
    if (!municipalityId) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `/api/guides?municipalityId=${municipalityId}`
      );
      setGuides(res.data);
    } catch {
      toast.error("Erro ao carregar os guias turísticos.");
    } finally {
      setIsLoading(false);
    }
  }, [municipalityId]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const processGuideData = async (
    data: GuideFormValues,
    imageFile: File | null,
    editingGuide: Guide | null
  ) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        languages: data.languages
          .split(",")
          .map((lang) => lang.trim())
          .filter(Boolean),
        municipalityId: editingGuide ? undefined : municipalityId,
        id: editingGuide?.id,
      };

      const response = editingGuide
        ? await axios.put("/api/guides", payload)
        : await axios.post("/api/guides", payload);

      const guide: Guide = response.data;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        await axios.post(`/api/guides/${guide.id}/image`, formData);
      }

      toast.success(
        `Guia ${editingGuide ? "atualizado" : "criado"} com sucesso!`
      );
      await fetchGuides();
    } catch (error) {
      toast.error("Erro ao salvar o guia.");
      throw error; // Propaga o erro para o componente poder reagir
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteGuide = async (id: string) => {
    setIsSubmitting(true);
    try {
      await axios.delete("/api/guides", { data: { id } });
      toast.success("Guia removido com sucesso!");
      await fetchGuides();
    } catch (error) {
      toast.error("Erro ao remover o guia.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    guides,
    isLoading,
    isSubmitting,
    processGuideData,
    deleteGuide,
  };
}
