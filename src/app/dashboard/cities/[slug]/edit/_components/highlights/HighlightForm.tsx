"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CoordinateInput } from "./CoordinateInput";
import { HighlightWithImages } from "../../_hooks/useHighlights";

export const highlightSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().optional(),
  latitude: z.number({ invalid_type_error: "Latitude inválida" }).optional(),
  longitude: z.number({ invalid_type_error: "Longitude inválido" }).optional(),
});

export type HighlightFormValues = z.infer<typeof highlightSchema>;

interface HighlightFormProps {
  onSubmit: (data: HighlightFormValues) => void;
  highlight?: HighlightWithImages | null;
  children: React.ReactNode;
}

export function HighlightForm({
  onSubmit,
  highlight,
  children,
}: HighlightFormProps) {
  const form = useForm<HighlightFormValues>({
    resolver: zodResolver(highlightSchema),
    defaultValues: {
      title: highlight?.title || "",
      description: highlight?.description || "",
      latitude: highlight?.latitude ?? undefined,
      longitude: highlight?.longitude ?? undefined,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Título do Destaque</Label>
        <Input {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea {...register("description")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="latitude"
          control={control}
          render={({ field }) => (
            <CoordinateInput
              label="Latitude"
              value={field.value}
              onChange={field.onChange}
              placeholder="-21.3456"
              error={errors.latitude?.message}
            />
          )}
        />
        <Controller
          name="longitude"
          control={control}
          render={({ field }) => (
            <CoordinateInput
              label="Longitude"
              value={field.value}
              onChange={field.onChange}
              placeholder="-47.1234"
              error={errors.longitude?.message}
            />
          )}
        />
      </div>
      {children}
    </form>
  );
}
