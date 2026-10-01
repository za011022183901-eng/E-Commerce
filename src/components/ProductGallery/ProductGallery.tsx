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
    <div className="w-full md:w-[55%] flex flex-col gap-4 sticky top-28">
      
      {/* ===== الصورة الكبيرة فوق ===== */}
      <div className="w-full bg-gray-50/70 rounded-3xl p-8 md:p-16 flex items-center justify-center relative border border-gray-100/80">
        <div className="w-full max-w-lg relative group">
          <AnimatePresence mode="wait"><motion.img key={activeImage} initial={{ opacity: 0, scale: .94, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }} src={activeImage} alt={title} className="object-contain h-[350px] md:h-[480px] w-full mix-blend-multiply transition-all duration-500 ease-out md:group-hover:scale-105" /></AnimatePresence>
        </div>
      </div>

      {/* ===== الصور الصغيرة تحت (متوسطة ومظبوطة بالظبط) ===== */}
      <div className="w-full px-2">
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          {/* تم إضافة flex و justify-center هنا لتوسيط الصور لو عددها قليل */}
          <CarouselContent className="-ml-2 md:-ml-3 flex justify-center">
            {galleryImages.map((img, i) => (
              <CarouselItem key={i} className="pl-2 md:pl-3 basis-1/4 sm:basis-1/5 md:basis-1/4 lg:basis-1/5 max-w-[120px]">
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
  );
}
