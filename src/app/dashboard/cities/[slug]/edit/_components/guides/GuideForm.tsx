"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Guide } from "@/generated";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const guideSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  email: z.string().email("Email inválido.").optional().or(z.literal("")),
  phone: z.string().min(1, "O telefone é obrigatório."),
  languages: z.string().min(1, "Informe pelo menos um idioma."),
  description: z.string().optional(),
});

export type GuideFormValues = z.infer<typeof guideSchema>;

interface GuideFormProps {
  guide?: Guide;
  onSubmit: (data: GuideFormValues, imageFile: File | null) => void;
  isSubmitting: boolean;
}

export function GuideForm({ guide, onSubmit, isSubmitting }: GuideFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    guide?.image || null
  );

  const form = useForm<GuideFormValues>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      name: guide?.name || "",
      email: guide?.email || "",
      phone: guide?.phone || "",
      languages: guide?.languages.join(", ") || "",
      description: guide?.description || "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleFormSubmit = (data: GuideFormValues) => {
    onSubmit(data, imageFile);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="flex items-center gap-4">
        <Image
          src={imagePreview || "/images/default-user.png"}
          alt="Foto do Guia"
          width={80}
          height={80}
          className="rounded-full object-cover border"
        />
        <div className="flex-1">
          <Label htmlFor="guide-image">Foto do Guia</Label>
          <Input
            id="guide-image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                const file = e.target.files[0];
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>
      </div>
      <div>
        <Label>Nome Completo</Label>
        <Input {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Email</Label>
          <Input type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label>Telefone / WhatsApp</Label>
          <Input {...register("phone")} />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label>Idiomas (separados por vírgula)</Label>
        <Input {...register("languages")} />
        {errors.languages && (
          <p className="text-sm text-red-500">{errors.languages.message}</p>
        )}
      </div>
      <div>
        <Label>Descrição / Apresentação</Label>
        <Textarea {...register("description")} />
      </div>
      <Button
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit(handleFormSubmit)}
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Salvar Guia"
        )}
      </Button>
    </form>
  );
}
