"use client";

import { TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Municipality } from "@/types/municipality";
import dynamic from "next/dynamic";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { MapPin } from "lucide-react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);

const iconMarkup = renderToStaticMarkup(<MapPin className="fill-red-600" />);
const customIcon = divIcon({
  html: iconMarkup,
  className: "", // Zera a classe para não ter estilos estranhos do Leaflet
  iconSize: [50, 50],
  iconAnchor: [16, 32],
});

export default function MunicipioMap({
  municipality,
}: {
  municipality: Municipality;
}) {
  if (
    typeof municipality.latitude !== "number" ||
    typeof municipality.longitude !== "number"
  ) {
    return null;
  }

  const coordinates: [number, number] = [
    municipality.latitude,
    municipality.longitude,
  ];
  return (
    <MapContainer
      center={coordinates}
      zoom={13}
      scrollWheelZoom={true}
      dragging={true}
      zoomControl={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coordinates} icon={customIcon}>
        <Popup>{municipality.name}</Popup>
      </Marker>
    </MapContainer>
  );
}
