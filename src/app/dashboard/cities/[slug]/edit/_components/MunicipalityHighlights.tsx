"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { Highlight } from "@/types/highligth";
import { Trash2, ImagePlus, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface MunicipalityHighlightsProps {
  municipalityId: string;
}

export function MunicipalityHighlights({
  municipalityId,
}: MunicipalityHighlightsProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHighlight, setNewHighlight] = useState<Partial<Highlight>>({
    title: "",
  });
  const [images, setImages] = useState<{ [key: string]: string[] }>({});
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "highlight" | "image";
    id: string;
    path?: string;
  } | null>(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await axios.get(`/api/highlights/${municipalityId}`);
        setHighlights(res.data);
        const imgs: any = {};
        for (const h of res.data) {
          if (h.id) {
            const { data } = await supabase.storage
              .from("adetur-bucket")
              .list(`highlights/${h.id}`);
            imgs[h.id] =
              data?.map(
                (f) =>
                  `https://uykxygmttywknvgtyxrv.supabase.co/storage/v1/object/public/adetur-bucket/highlights/${h.id}/${f.name}`
              ) || [];
          }
        }
        setImages(imgs);
      } catch (err) {
        toast.error("Erro ao buscar destaques turísticos");
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, [municipalityId]);

  const handleUpdate = async (index: number) => {
    const highlight = highlights[index];
    try {
      await axios.put(`/api/highlights/${highlight.id}`, highlight);
      toast.success("Destaque atualizado");
    } catch {
      toast.error("Erro ao atualizar destaque");
    }
  };

  const deleteItem = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "highlight") {
        await axios.delete(`/api/highlights/${deleteTarget.id}`);
        await supabase.storage
          .from("adetur-bucket")
          .remove([`highlights/${deleteTarget.id}`]);
        setHighlights((prev) => prev.filter((h) => h.id !== deleteTarget.id));
        toast.success("Destaque removido");
      } else if (deleteTarget.type === "image" && deleteTarget.path) {
        await supabase.storage
          .from("adetur-bucket")
          .remove([
            `highlights/${deleteTarget.id}/${deleteTarget.path
              .split("/")
              .pop()}`,
          ]);
        setImages((prev) => ({
          ...prev,
          [deleteTarget.id]: prev[deleteTarget.id].filter(
            (img) => img !== deleteTarget.path
          ),
        }));
        toast.success("Imagem removida");
      }
    } catch {
      toast.error("Erro ao remover");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await axios.post(`/api/highlights`, {
        ...newHighlight,
        municipalityId,
      });
      setHighlights((prev) => [...prev, res.data]);
      setNewHighlight({ title: "" });
      toast.success("Destaque criado");
    } catch {
      toast.error("Erro ao criar destaque");
    }
  };

  const handleImageUpload = async (files: FileList, highlightId: string) => {
    const uploadedUrls: string[] = [];
    for (const file of Array.from(files)) {
      const { data, error } = await supabase.storage
        .from("adetur-bucket")
        .upload(`highlights/${highlightId}/${file.name}`, file);
      if (!error) {
        const publicUrl = `https://[YOUR_SUPABASE_URL]/storage/v1/object/public/adetur-bucket/${data.path}`;
        uploadedUrls.push(publicUrl);
      }
    }
    setImages((prev) => ({
      ...prev,
      [highlightId]: [...(prev[highlightId] || []), ...uploadedUrls],
    }));
  };

  const handleChange = (index: number, field: keyof Highlight, value: any) => {
    setHighlights((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  if (loading) return <p>Carregando destaques...</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Destaques Turísticos</h3>

      {highlights.map((highlight, index) => (
        <div key={highlight.id} className="border p-4 rounded space-y-2">
          <Label>Título</Label>
          <Input
            value={highlight.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
          />
          <Label>Descrição</Label>
          <Textarea
            value={highlight.description || ""}
            onChange={(e) => handleChange(index, "description", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Latitude</Label>
              <Input
                type="text"
                value={highlight.latitude || ""}
                onChange={(e) =>
                  handleChange(index, "latitude", parseFloat(e.target.value))
                }
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                type="text"
                value={highlight.longitude || ""}
                onChange={(e) =>
                  handleChange(index, "longitude", parseFloat(e.target.value))
                }
              />
            </div>
          </div>

          <div>
            <Label>Imagens</Label>
            <div className="flex flex-wrap gap-2 my-2">
              {images[highlight.id!] &&
                images[highlight.id!].map((url) => (
                  <div key={url} className="relative w-24 h-24">
                    <img
                      src={url}
                      alt="Imagem"
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                      onClick={() =>
                        setDeleteTarget({
                          type: "image",
                          id: highlight.id!,
                          path: url,
                        })
                      }
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
            </div>
            <Input
              type="file"
              multiple
              onChange={(e) =>
                e.target.files &&
                handleImageUpload(e.target.files, highlight.id!)
              }
            />
          </div>

          <div className="flex gap-2 mt-2">
            <Button onClick={() => handleUpdate(index)}>Salvar</Button>
            <Button
              variant="destructive"
              onClick={() =>
                setDeleteTarget({ type: "highlight", id: highlight.id! })
              }
            >
              Remover
              <Trash2 />
            </Button>
          </div>
        </div>
      ))}

      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-2">Adicionar novo destaque</h4>
        <Input
          placeholder="Título"
          value={newHighlight.title || ""}
          onChange={(e) =>
            setNewHighlight({ ...newHighlight, title: e.target.value })
          }
        />
        <Textarea
          className="mt-2"
          placeholder="Descrição"
          value={newHighlight.description || ""}
          onChange={(e) =>
            setNewHighlight({ ...newHighlight, description: e.target.value })
          }
        />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            type="text"
            placeholder="Latitude"
            value={newHighlight.latitude || ""}
            onChange={(e) =>
              setNewHighlight({
                ...newHighlight,
                latitude: parseFloat(e.target.value),
              })
            }
          />
          <Input
            type="text"
            placeholder="Longitude"
            value={newHighlight.longitude || ""}
            onChange={(e) =>
              setNewHighlight({
                ...newHighlight,
                longitude: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <Button className="mt-2" onClick={handleCreate}>
          Adicionar Destaque
        </Button>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tem certeza que deseja excluir?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteItem}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
