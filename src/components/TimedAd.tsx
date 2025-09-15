
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { timedAds } from '@/lib/affiliate-ads';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const CLOSE_DELAY = 15000; // 15 segundos
const REAPPEAR_DELAY = 300000; // 5 minutos
const AD_ROTATION_INTERVAL = 10000; // 10 segundos

export function TimedAd() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [canClose, setCanClose] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Efeito para o timer de fechamento
  useEffect(() => {
    if (isVisible) {
      setCanClose(false); // Reseta a permissão para fechar
      const enableCloseTimer = setTimeout(() => {
        setCanClose(true);
      }, CLOSE_DELAY);

      return () => clearTimeout(enableCloseTimer);
    }
  }, [isVisible]);

  // Efeito para a rotação de anúncios
  useEffect(() => {
    if (timedAds.length <= 1 || !isVisible) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % timedAds.length);
        setIsTransitioning(false);
      }, 500); // Duração da animação de saída
    }, AD_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    
    // Timer para o reaparecimento do anúncio
    const reappearTimer = setTimeout(() => {
      setIsVisible(true);
    }, REAPPEAR_DELAY);
    
    // Idealmente, este timer seria limpo se o componente fosse desmontado
    return () => clearTimeout(reappearTimer);
  };
  
  if (!isVisible) {
    return null;
  }
  
  if (timedAds.length === 0) {
    return null;
  }

  const ad = timedAds[currentAdIndex];

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative w-full rounded-lg bg-card/80 backdrop-blur-xl p-0 border border-border shadow-md transition-all duration-300 ease-in-out"
        )}
      >
        <Link href={ad.link} target="_blank" rel="noopener noreferrer" className="group block">
            <div
              className={cn(
                "relative flex items-center gap-3 w-full p-2 transition-all duration-500 ease-in-out",
                isTransitioning ? "opacity-0 -translate-y-2" : "opacity-100 transform-none"
              )}
            >
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={ad.imageUrl.startsWith('//') ? `https:${ad.imageUrl}` : ad.imageUrl}
                  alt={ad.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  data-ai-hint="product image"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">{ad.title}</p>
                <div className="flex items-center gap-2">
                    {ad.price && <p className="text-sm font-bold text-green-400">{ad.price}</p>}
                    <p className={cn("text-xs text-muted-foreground truncate", ad.price && "line-through")}>{ad.description}</p>
                </div>
              </div>
               <Badge variant={ad.source === 'Shopee' ? 'default' : 'secondary'} className={cn(
                   ad.source === 'Shopee' ? 'bg-[#FF6A00] hover:bg-[#FF6A00]/90' : 'bg-secondary text-secondary-foreground',
                   'text-white text-xs'
               )}>
                {ad.source}
              </Badge>
            </div>
        </Link>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleClose}
          disabled={!canClose}
          className="h-6 w-6 rounded-full absolute top-1 right-1 bg-black/40 hover:bg-black/60 disabled:bg-black/20 disabled:cursor-not-allowed"
          aria-label="Fechar anúncio"
        >
          <X className={cn("h-4 w-4 text-white", !canClose && "text-white/40")} />
        </Button>
      </div>
    </div>
  );
}

