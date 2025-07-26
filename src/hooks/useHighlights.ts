import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Highlight } from "@/types/highligth";

export function useHighlights(municipalityId: string) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [images, setImages] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHighlights = useCallback(async () => {
    if (!municipalityId) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/highlights/${municipalityId}`);
      const highlightsData: Highlight[] = res.data;
      setHighlights(highlightsData);

      const imagePromises = highlightsData.map(async (h) => {
        if (!h.id) return { id: h.id, urls: [] };
        const response = await axios.get(`/api/highlights/${h.id}/images`);
        return { id: h.id, urls: response.data.urls || [] };
      });

      const imagesData = await Promise.all(imagePromises);
      const imagesMap = imagesData.reduce((acc, item) => {
        if (item.id) acc[item.id] = item.urls;
        return acc;
      }, {} as { [key: string]: string[] });
      setImages(imagesMap);
    } catch (err) {
      toast.error("Erro ao buscar dados dos destaques.");
    } finally {
      setIsLoading(false);
    }
  }, [municipalityId]);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  const uploadImages = async (highlightId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    await axios.post(`/api/highlights/${highlightId}/images`, formData);
  };

  const createHighlight = async (
    data: Partial<Highlight>,
    files: File[] = []
  ) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/highlights`, {
        ...data,
        municipalityId,
      });
      const newHighlight: Highlight = response.data;

      if (newHighlight.id && files.length > 0) {
        await uploadImages(newHighlight.id, files);
      }

      toast.success("Destaque criado com sucesso!");
      await fetchHighlights();
    } catch (error) {
      toast.error("Erro ao criar o novo destaque.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateHighlight = async (
    data: Partial<Highlight>,
    newFiles: File[] = []
  ) => {
    if (!data.id) return;
    setIsSubmitting(true);
    try {
      await axios.put(`/api/highlights/${data.id}`, data);
      if (newFiles.length > 0) {
        await uploadImages(data.id, newFiles);
      }
      toast.success("Destaque atualizado com sucesso!");
      await fetchHighlights();
    } catch (error) {
      toast.error("Erro ao atualizar o destaque.");
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

  const removeImage = async (highlightId: string, imageUrl: string) => {
    try {
      await axios.delete(`/api/highlights/${highlightId}/images`, {
        data: { url: imageUrl },
      });
      toast.success("Imagem removida com sucesso!");
      await fetchHighlights();
    } catch (error) {
      toast.error("Erro ao remover a imagem.");
      throw error;
    }
  };

  return {
    highlights,
    images,
    isLoading,
    isSubmitting,
    createHighlight,
    updateHighlight,
    deleteHighlight,
    removeImage,
    uploadImages,
    refetch: fetchHighlights,
  };
}
