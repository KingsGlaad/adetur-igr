"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { municipalities } from "@/data/site-data";
import { LatLngTuple } from "leaflet";
import { useState } from "react";
import Image from "next/image";

// Coordenadas aproximadas do centro da região
const CENTER: LatLngTuple = [-20.5, -47.5];
const ZOOM = 13;

// Coordenadas dos municípios (exemplo - você precisará ajustar com as coordenadas reais)
const MUNICIPALITIES_COORDINATES: Record<string, LatLngTuple> = {
  "São Simão": [-21.4733, -47.5508],
  Altinópolis: [-21.0256, -47.3719],
  "Santo Antônio da Alegria": [-21.0869, -47.1469],
  "Luís Antônio": [-21.5519, -47.7008],
  Cajuru: [-21.2758, -47.3039],
  "Cássia dos Coqueiros": [-21.2808, -47.1689],
  "Santa Rosa de Viterbo": [-21.4733, -47.3639],
};

// Ícone personalizado para os marcadores
const customIcon = new Icon({
  iconUrl: "/map-pin.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Componente para atualizar o centro do mapa
function ChangeView({ center }: { center: LatLngTuple }) {
  const map = useMap();
  map.setView(center, ZOOM);
  return null;
}

export default function MunicipiosPage() {
  const [mapCenter, setMapCenter] = useState<LatLngTuple>(CENTER);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null);

  const handleCardClick = (municipalityName: string) => {
    const coordinates = MUNICIPALITIES_COORDINATES[municipalityName];
    if (coordinates) {
      setMapCenter(coordinates);
      setSelectedMunicipality(municipalityName);
    }
  };

  const selectedMunicipalityData = selectedMunicipality
    ? municipalities.find((m) => m.name === selectedMunicipality)
    : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Lista de Municípios com Scroll */}
      <div className="w-full lg:w-2/5 bg-neutral-900">
        <div className="container mx-auto px-8 py-8 max-w-xl">
          <h1 className="text-3xl font-bold text-white mb-8">Municípios</h1>
          <div className="grid gap-4">
            {municipalities.map((municipality) => (
              <div
                key={municipality.name}
                className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden cursor-pointer hover:border-neutral-500 transition-colors"
                onClick={() => handleCardClick(municipality.name)}
              >
                <div className="relative h-32">
                  <Image
                    src={municipality.image.src}
                    alt={municipality.name}
                    width={municipality.image.width}
                    height={municipality.image.height}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white mb-1">
                    {municipality.name}
                  </h2>
                  <p className="text-sm text-neutral-400 mb-2 line-clamp-2">
                    {municipality.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {municipality.highlight.slice(0, 2).map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded-full text-xs"
                      >
                        {item}
                      </span>
                    ))}
                    {municipality.highlight.length > 2 && (
                      <span className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded-full text-xs">
                        +{municipality.highlight.length - 2} mais
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/municipios/${municipality.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="inline-flex items-center justify-center w-full px-3 py-1.5 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition-colors text-sm"
                  >
                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mapa e Informações */}
      <div className="hidden lg:block w-full lg:w-3/5 h-[calc(100vh-4rem)] sticky top-16">
        <div className="h-[60%] px-8 py-4">
          <MapContainer
            center={mapCenter}
            zoom={ZOOM}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
            dragging={true}
            scrollWheelZoom={true}
            doubleClickZoom={true}
          >
            <ChangeView center={mapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {municipalities.map((municipality) => {
              const coordinates = MUNICIPALITIES_COORDINATES[municipality.name];
              if (!coordinates) return null;

              return (
                <Marker
                  key={municipality.name}
                  position={coordinates}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{municipality.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {municipality.description}
                      </p>
                      <Link
                        href={`/municipios/${municipality.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="text-primary text-sm hover:underline mt-2 inline-block"
                      >
                        Ver mais detalhes
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Informações do Município Selecionado */}
        {selectedMunicipalityData && (
          <div className="h-[40%] px-8 py-4 bg-neutral-800">
            <div className="h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-4">
                {selectedMunicipalityData.name}
              </h2>
              <div className="flex gap-4 h-full">
                <div className="w-1/3">
                  <div className="relative h-full rounded-lg overflow-hidden">
                    <Image
                      src={selectedMunicipalityData.image.src}
                      alt={selectedMunicipalityData.name}
                      width={selectedMunicipalityData.image.width}
                      height={selectedMunicipalityData.image.height}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="w-2/3 flex flex-col">
                  <p className="text-neutral-300 mb-4">
                    {selectedMunicipalityData.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedMunicipalityData.highlight
                      .slice(0, 3)
                      .map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-neutral-700 text-neutral-300 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    {selectedMunicipalityData.highlight.length > 3 && (
                      <span className="px-3 py-1 bg-neutral-700 text-neutral-300 rounded-full text-sm">
                        +{selectedMunicipalityData.highlight.length - 3} mais
                      </span>
                    )}
                  </div>
                  <div className="mt-auto">
                    <Link
                      href={`/municipios/${selectedMunicipalityData.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition-colors"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
