"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PublicImageGalleryProps {
  images: string[];
  municipalityName: string;
}

export function PublicImageGallery({
  images,
  municipalityName,
}: PublicImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Se não houver imagens, mostra um placeholder.
  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full flex items-center justify-center bg-slate-200 rounded-lg">
        <span className="text-slate-500">Nenhuma imagem disponível</span>
      </div>
    );
  }

  // Função para ir para a imagem anterior
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // Função para ir para a próxima imagem
  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Efeito para trocar de imagem automaticamente a cada 5 segundos
  useEffect(() => {
    // Só ativa o temporizador se houver mais de uma imagem
    if (images.length > 1) {
      const timer = setTimeout(goToNext, 5000);
      // Limpa o temporizador quando o componente é desmontado ou o índice muda
      return () => clearTimeout(timer);
    }
  }, [currentIndex, images.length]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg group">
      {/* Container para as imagens com transição */}
      <div className="w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{ opacity: index === currentIndex ? 1 : 0 }}
          >
            <Image
              src={image}
              alt={`Imagem ${index + 1} de ${municipalityName}`}
              fill
              className="object-cover"
              priority={index === 0} // Carrega a primeira imagem com prioridade
            />
          </div>
        ))}
      </div>

      {/* Controlos de Navegação (Setas) - Visíveis apenas com mais de uma imagem */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
            aria-label="Imagem anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
            aria-label="Próxima imagem"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicadores de Navegação (Pontos) - Visíveis apenas com mais de uma imagem */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => setCurrentIndex(slideIndex)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentIndex === slideIndex ? "bg-white w-4" : "bg-white/50"
              }`}
              aria-label={`Ir para a imagem ${slideIndex + 1}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
