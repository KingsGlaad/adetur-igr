export type Municipality = {
  id: string;
  name: string;
  about: string | null;
  description: string | null;
  coatOfArms: string | null;
  latitude: number | null;
  longitude: number | null;
  highlights: { title: string; id: string }[] | null;
};
