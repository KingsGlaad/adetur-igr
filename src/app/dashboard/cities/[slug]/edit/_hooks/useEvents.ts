import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Event } from "@/generated";
import { EventFormValues } from "../_components/events/EventForm";

export function useEvents(municipalityId: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!municipalityId) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `/api/events?municipalityId=${municipalityId}`
      );
      setEvents(res.data);
    } catch {
      toast.error("Erro ao carregar os eventos.");
    } finally {
      setIsLoading(false);
    }
  }, [municipalityId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const processEventData = async (
    data: EventFormValues,
    imageFile: File | null,
    editingEvent: Event | null
  ) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        date: new Date(data.date).toISOString(),
        municipalityId: editingEvent ? undefined : municipalityId,
        id: editingEvent?.id,
      };

      const response = editingEvent
        ? await axios.put("/api/events", payload)
        : await axios.post("/api/events", payload);

      const event: Event = response.data;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        await axios.post(`/api/events/${event.id}/image`, formData);
      }

      toast.success(
        `Evento ${editingEvent ? "atualizado" : "criado"} com sucesso!`
      );
      await fetchEvents();
    } catch (error) {
      toast.error("Erro ao salvar o evento.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEvent = async (id: string) => {
    setIsSubmitting(true);
    try {
      await axios.delete("/api/events", { data: { id } });
      toast.success("Evento removido com sucesso!");
      await fetchEvents();
    } catch (error) {
      toast.error("Erro ao remover o evento.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    events,
    isLoading,
    isSubmitting,
    processEventData,
    deleteEvent,
  };
}
