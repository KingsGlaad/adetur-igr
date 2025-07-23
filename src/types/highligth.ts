// types/highlight.ts
export interface Highlight {
  id: string;
  title: string;
  description?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  municipalityId: string;
  createdAt: string; // ou Date se você estiver convertendo com new Date()
}
