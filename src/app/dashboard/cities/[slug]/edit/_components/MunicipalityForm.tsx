/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MunicipalityRefined } from "@/types/municipality";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link as TipTapLink } from "@tiptap/extension-link";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo,
  Redo,
  Minus,
  Link2,
  Quote,
} from "lucide-react";

// Schema com validação Zod
const municipalitySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  about: z.string().min(1, "O campo 'Sobre' é obrigatório"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  coatOfArms: z.string().optional(),
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
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: { class: "list-disc pl-6 space-y-2" },
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-6 space-y-2" },
        },
        blockquote: {
          HTMLAttributes: {
            class:
              "border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic bg-gray-50 dark:bg-gray-800/50 py-2 rounded-r",
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "font-bold text-gray-900 dark:text-white",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "my-4 border-t border-gray-300 dark:border-gray-600",
          },
        },
      }),
      TipTapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          class: "text-blue-500 hover:underline",
        },
      }),
    ],
    content: municipio.about,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] p-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
      },
    },
    onUpdate: ({ editor }) => {
      setValue("about", editor.getHTML(), { shouldValidate: true });
    },
  });

  const coatOfArms = watch("coatOfArms");

  const onSubmit: SubmitHandler<MunicipalityFormValues> = async (data: any) => {
    let uploadedUrl = data.coatOfArms;

    if (file) {
      const imageData = new FormData();
      imageData.append("file", file);

      const uploadRes = await axios.post("/api/upload", imageData);
      uploadedUrl = uploadRes.data.url;
    }

    const req = await axios.put(`/api/municipios/${municipio.slug}`, {
      ...data,
      coatOfArms: uploadedUrl,
    });

    if (req.status === 200) {
      toast.success("Município atualizado com sucesso!");
      router.push(`/dashboard/cities/${municipio.slug}`);
    } else {
      toast.error("Erro ao atualizar o município");
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
        <div className="space-y-2">
          <div className="border rounded-md">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
          {errors.about && (
            <p className="text-sm text-red-500">{errors.about.message}</p>
          )}
        </div>
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
}
const MenuBar = ({ editor }: { editor: any }) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) return null;

  const setLink = () => {
    if (!linkUrl || editor.state.selection.empty) return;
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setShowLinkDialog(false);
    setLinkUrl("");
  };

  return (
    <>
      <div className="border-b p-2 flex gap-1">
        <ToolButton
          icon={<Bold className="h-4 w-4" />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        />
        <ToolButton
          icon={<Italic className="h-4 w-4" />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        />
        <ToolButton
          icon={<List className="h-4 w-4" />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        />
        <ToolButton
          icon={<ListOrdered className="h-4 w-4" />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        />
        <ToolButton
          icon={<Quote className="h-4 w-4" />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        />
        <ToolButton
          icon={<Link2 className="h-4 w-4" />}
          onClick={() => setShowLinkDialog(true)}
          active={editor.isActive("link")}
        />
        <ToolButton
          icon={<Minus className="h-4 w-4" />}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
        <ToolButton
          icon={<Undo className="h-4 w-4" />}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        />
        <ToolButton
          icon={<Redo className="h-4 w-4" />}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        />
      </div>

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Link</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Cole a URL do link"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setLink();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={setLink}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ToolButton = ({
  icon,
  onClick,
  active,
  disabled,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    className={`hover:bg-gray-100 transition-colors ${
      active ? "bg-gray-100 text-blue-600" : ""
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {icon}
  </Button>
);
