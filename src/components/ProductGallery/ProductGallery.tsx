'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: GalleryProps) {
  const galleryImages = images.filter(Boolean);
  // الـ State اللي شايلة الصورة الكبيرة اللي معروضة حالياً
  const [activeImage, setActiveImage] = useState(galleryImages[0] ?? "");
  useEffect(() => { setActiveImage(galleryImages[0] ?? ""); }, [galleryImages[0]]);

  return (
    <>
    <div className="fixed left-0 right-0 top-20 z-20 flex w-full self-start flex-col gap-3 bg-white/95 px-3 py-2 backdrop-blur-sm md:sticky md:left-auto md:right-auto md:top-28 md:z-auto md:w-[55%] md:gap-4 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
      
      {/* ===== الصورة الكبيرة فوق ===== */}
      <div className="relative flex w-full items-center justify-center rounded-3xl border border-gray-100/80 bg-gray-50/70 p-3 sm:p-5 md:p-16">
        <div className="w-full max-w-lg relative group">
          <AnimatePresence mode="wait"><motion.img key={activeImage} initial={{ opacity: 0, scale: .94, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }} src={activeImage} alt={title} className="h-[230px] w-full object-contain mix-blend-multiply transition-all duration-500 ease-out sm:h-[280px] md:h-[480px] md:group-hover:scale-105" /></AnimatePresence>
        </div>
      </div>

      {/* ===== الصور الصغيرة تحت (متوسطة ومظبوطة بالظبط) ===== */}
      <div className="w-full px-2">
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className={`-ml-2 flex md:-ml-3 ${galleryImages.length <= 3 ? "justify-center" : "justify-start"}`}>
            {galleryImages.map((img, i) => (
              <CarouselItem key={i} className="basis-1/4 max-w-[120px] pl-2 sm:basis-1/4 md:basis-1/4 md:pl-3 lg:basis-1/5">
                <button
                  onClick={() => setActiveImage(img)}
                  className={`w-full aspect-square bg-gray-50 rounded-2xl p-2 border-2 transition-all duration-300 overflow-hidden flex items-center justify-center ${
                    activeImage === img 
                      ? 'border-green-500 shadow-md ring-2 ring-green-500/10 scale-95' 
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${title} - thumb ${i + 1}`}
                    className="object-contain max-h-full max-w-full mix-blend-multiply"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* أسهم تظهر فقط لو الصور كتيرة ومحتاجة تقليب */}
          {galleryImages.length > 4 && (
            <>
              <CarouselPrevious className="-left-4 w-8 h-8 bg-white shadow-sm border border-gray-100 text-gray-600" />
              <CarouselNext className="-right-4 w-8 h-8 bg-white shadow-sm border border-gray-100 text-gray-600" />
            </>
          )}
        </Carousel>
      </div>

    </div>
    <div aria-hidden="true" className="h-[370px] sm:h-[470px] md:hidden" />
    </>
  );
}
