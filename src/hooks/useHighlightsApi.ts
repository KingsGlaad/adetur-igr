import { Highlight } from "@/types/highligth";
import { useCallback } from "react";

export function useHighlightsApi(municipalityId: string) {
  const getHighlights = useCallback(async (): Promise<Highlight[]> => {
    const res = await fetch(`/api/highlights/${municipalityId}`);
    if (!res.ok) throw new Error("Erro ao buscar destaques");
    return await res.json();
  }, [municipalityId]);

  const createHighlight = useCallback(
    async (data: Omit<Highlight, "id">) => {
      const res = await fetch(`/api/highlights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, municipalityId }),
      });
      if (!res.ok) throw new Error("Erro ao criar destaque");
      return await res.json();
    },
    [municipalityId]
  );

  const updateHighlight = useCallback(
    async (id: string, data: Partial<Highlight>) => {
      const res = await fetch(`/api/highlights/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao atualizar destaque");
      return await res.json();
    },
    []
  );

  const deleteHighlight = useCallback(async (id: string) => {
    const res = await fetch(`/api/highlights/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao deletar destaque");
    return true;
  }, []);

  return { getHighlights, createHighlight, updateHighlight, deleteHighlight };
}
