"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface HotelImage {
  id: string;
  image_url: string;
  alt_text?: string;
}

interface Props {
  heroImage: string;
  hotelName: string;
  images: HotelImage[];
}

export default function HotelGallery({ heroImage, hotelName, images }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // All images: hero first, then gallery
  const allImages = [
    { id: "hero", image_url: heroImage, alt_text: hotelName },
    ...images,
  ];

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, prev, next]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  const extraCount = images.length - 2; // images beyond the 2 shown thumbnails

  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8 rounded-2xl overflow-hidden h-[300px] md:h-[420px]">
        {/* Hero */}
        <div className="md:col-span-2 h-full cursor-pointer relative" onClick={() => openLightbox(0)}>
          <Image
            src={heroImage}
            alt={hotelName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover hover:brightness-90 transition-all duration-300"
          />
        </div>

        {/* Thumbnails — only shown if gallery images exist */}
        {images.length > 0 && (
          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
            {/* First thumbnail */}
            <div className="overflow-hidden h-full cursor-pointer relative" onClick={() => openLightbox(1)}>
              <Image
                src={images[0].image_url}
                alt={images[0].alt_text || hotelName}
                fill
                sizes="33vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Second thumbnail — with +N overlay if more images exist */}
            {images.length >= 2 && (
              <div className="overflow-hidden h-full cursor-pointer relative" onClick={() => openLightbox(2)}>
                <Image
                  src={images[1].image_url}
                  alt={images[1].alt_text || hotelName}
                  fill
                  sizes="33vw"
                  className={`object-cover transition-transform duration-300 ${extraCount > 0 ? "brightness-50" : ""}`}
                />
                {extraCount > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold drop-shadow-lg">+{extraCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={closeLightbox}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-white/70 text-sm">
              {activeIndex + 1} / {allImages.length}
            </span>
            <p className="text-white font-medium text-sm truncate max-w-xs">{hotelName}</p>
            <button
              onClick={closeLightbox}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main image */}
          <div
            className="flex-1 flex items-center justify-center relative px-12 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={prev}
              className="absolute left-2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={allImages[activeIndex].image_url}
              alt={allImages[activeIndex].alt_text || hotelName}
              className="max-h-full max-w-full object-contain rounded-lg select-none"
              draggable={false}
            />

            <button
              onClick={next}
              className="absolute right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div
            className="shrink-0 px-5 py-4 flex gap-2 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {allImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeIndex ? "border-white scale-105" : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={img.image_url} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
