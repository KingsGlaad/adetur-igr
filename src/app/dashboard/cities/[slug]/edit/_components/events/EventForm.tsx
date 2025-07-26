"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Event, EventImage } from "@/generated";
import { validateImageFile } from "@/lib/image-validator";
import { EventImageGallery } from "./EventImageGallery"; // Importe a galeria

// O schema agora espera um objeto Date para a data, o que é mais robusto.
export const eventSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().min(1, "A descrição é obrigatória."),
  date: z.date({
    required_error: "A data do evento é obrigatória.",
  }),
});

export type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  onSubmit: (data: EventFormValues, imageFile: File | null) => void;
  isSubmitting: boolean;
}

export function EventForm({ event, onSubmit, isSubmitting }: EventFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.image || null
  );

  // Estados para a galeria de imagens do evento
  const [galleryImages, setGalleryImages] = useState<EventImage[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      date: event?.date ? new Date(event.date) : undefined,
    },
  });

  // Lógica para buscar e gerir a galeria
  useEffect(() => {
    const fetchGallery = async () => {
      if (!event?.id) {
        setGalleryImages([]);
        return;
      }
      setIsGalleryLoading(true);
      try {
        const res = await axios.get(`/api/events/${event.id}/gallery`);
        setGalleryImages(res.data);
      } catch {
        toast.error("Erro ao carregar a galeria do evento.");
      } finally {
        setIsGalleryLoading(false);
      }
    };
    fetchGallery();
  }, [event?.id]);

  const handleAddGalleryImages = async (files: File[]) => {
    if (!event?.id) {
      toast.error(
        "Guarde o evento primeiro para poder adicionar imagens à galeria."
      );
      return;
    }
    setIsGalleryLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    try {
      await axios.post(`/api/events/${event.id}/gallery`, formData);
      toast.success("Imagens adicionadas!");
      const res = await axios.get(`/api/events/${event.id}/gallery`);
      setGalleryImages(res.data);
    } catch {
      toast.error("Erro ao adicionar imagens.");
    } finally {
      setIsGalleryLoading(false);
    }
  };

  const handleRemoveGalleryImage = async (imageId: string) => {
    try {
      await axios.delete(`/api/events/${event?.id}/gallery`, {
        data: { imageId },
      }); // A API de remoção pode ser genérica
      toast.success("Imagem removida!");
      setGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      toast.error("Erro ao remover imagem.");
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const handleFormSubmit = (data: EventFormValues) => {
    onSubmit(data, imageFile);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        e.target.value = "";
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Upload de Imagem de Capa */}
      <div>
        <Label>Foto de Capa do Evento</Label>
        <div className="flex items-center gap-4 mt-1">
          <Image
            src={imagePreview || "/images/no-image.jpg"}
            alt="Foto do Evento"
            width={80}
            height={80}
            className="object-cover border rounded-md"
          />
          <Input
            id="event-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* Galeria de Imagens do Evento */}
      {event && (
        <EventImageGallery
          images={galleryImages}
          onAddImages={handleAddGalleryImages}
          onRemoveImage={handleRemoveGalleryImage}
          isUploading={isGalleryLoading}
        />
      )}

      <hr />

      {/* Título e Descrição */}
      <div>
        <Label>Nome do Evento</Label>
        <Input {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Seletor de Data com Shadcn Calendar */}
      <div>
        <Label>Data do Evento</Label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "PPP", { locale: ptBR })
                  ) : (
                    <span>Escolha uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.date && (
          <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
        )}
      </div>

      <Button
        type="button"
        disabled={isSubmitting}
        className="w-full"
        onClick={handleSubmit(handleFormSubmit)}
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Salvar Evento"
        )}
      </Button>
    </form>
  );
}
