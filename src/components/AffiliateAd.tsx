"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { affiliateAds } from '@/lib/affiliate-ads';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function AffiliateAd() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (affiliateAds.length <= 1) return;

    const interval = setInterval(() => {
      setIsVisible(false); // Começa a transição de saída
      setTimeout(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % affiliateAds.length);
        setIsVisible(true); // Começa a transição de entrada
      }, 500); // Meio segundo para a transição
    }, 10000); // Muda a cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  if (affiliateAds.length === 0) {
    return null;
  }

  const ad = affiliateAds[currentAdIndex];

  return (
    <div className="w-full">
      <Link href={ad.link} target="_blank" rel="noopener noreferrer" className="group">
        <div
          className={cn(
            "relative flex items-center gap-3 w-full rounded-lg bg-card/80 backdrop-blur-xl p-2 border border-border shadow-md transition-all duration-500 ease-in-out",
            isVisible ? "opacity-100 transform-none" : "opacity-0 -translate-y-2"
          )}
        >
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              data-ai-hint="product image"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">{ad.title}</p>
            <p className="text-xs text-muted-foreground truncate">{ad.description}</p>
          </div>
           <Badge variant={ad.source === 'Shopee' ? 'default' : 'secondary'} className={cn(
               ad.source === 'Shopee' ? 'bg-[#FF6A00] hover:bg-[#FF6A00]/90' : 'bg-[#FF4747] hover:bg-[#FF4747]/90',
               'text-white'
           )}>
            {ad.source}
          </Badge>
        </div>
      </Link>
    </div>
  );
}
