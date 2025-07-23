"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MunicipalityRefined } from "@/types/municipality";
import { MunicipalityHighlights } from "./MunicipalityHighlights";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link as TipTapLink } from "@tiptap/extension-link";

const municipalitySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  about: z.string().min(1, "O campo 'Sobre' é obrigatório"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  coatOfArms: z.string().optional(),
  highlights: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1, "Título obrigatório"),
        description: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
    )
    .optional(),
});

type MunicipalityFormValues = z.infer<typeof municipalitySchema>;

interface MunicipalityFormProps {
  municipio: MunicipalityRefined;
}

export function MunicipalityForm({ municipio }: MunicipalityFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MunicipalityFormValues>({
    resolver: zodResolver(municipalitySchema),
    defaultValues: {
      name: municipio.name,
      description: municipio.description ?? "",
      about: municipio.about ?? "",
      latitude: municipio.latitude ?? undefined,
      longitude: municipio.longitude ?? undefined,
      coatOfArms: municipio.coatOfArms ?? "",
      highlights: municipio.highlights ?? [],
    },
  });

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: "highlights",
  });

  const editor = useEditor({
    extensions: [StarterKit, TipTapLink.configure({ openOnClick: false })],
    content: municipio.about,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      setValue("about", editor.getHTML(), { shouldValidate: true });
    },
  });

  const coatOfArms = watch("coatOfArms");

  const onSubmit: SubmitHandler<MunicipalityFormValues> = async (data) => {
    try {
      let uploadedUrl = data.coatOfArms;

      if (file) {
        const imageData = new FormData();
        imageData.append("file", file);
        const uploadRes = await axios.post("/api/upload", imageData);
        uploadedUrl = uploadRes.data.url;
      }

      await axios.put(`/api/municipios/${municipio.slug}`, {
        ...data,
        coatOfArms: uploadedUrl,
      });

      toast.success("Município atualizado com sucesso!");
      router.push(`/dashboard/cities/${municipio.slug}`);
    } catch (error) {
      toast.error("Erro ao atualizar o município.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <Label>Imagem Atual</Label>
        <div className="mt-2">
          <Image
            src={coatOfArms || "/images/no-image.jpg"}
            alt="Coat of Arms"
            width={200}
            height={100}
            className="object-cover rounded"
          />
        </div>
      </div>
      <div>
        <Label>Alterar Imagem</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />
      </div>
      <div>
        <Label>Nome</Label>
        <Input {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div>
        <Label>Sobre</Label>
        <div className="border rounded-md">
          <EditorContent editor={editor} />
        </div>
        {errors.about && (
          <p className="text-sm text-red-500">{errors.about.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Latitude</Label>
          <Input {...register("latitude")} />
        </div>
        <div>
          <Label>Longitude</Label>
          <Input {...register("longitude")} />
        </div>
      </div>

      <MunicipalityHighlights municipalityId={municipio.id} />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
}
