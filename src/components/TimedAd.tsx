"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AffiliateAd } from '@/lib/affiliate-ads';

const ad: AffiliateAd = {
    id: 'timed-ad-1',
    imageUrl: 'https://ae01.alicdn.com/kf/Sff02da080ee1493cbe4f5b1803d7af18L.jpg',
    title: 'Nova Oferta Imperdível',
    description: 'Produtos selecionados para você.',
    link: 'https://s.click.aliexpress.com/e/_okAkbFN',
    source: 'AliExpress',
};

const CLOSE_DELAY = 15000; // 15 segundos
const REAPPEAR_DELAY = 300000; // 5 minutos

export function TimedAd() {
  const [isVisible, setIsVisible] = useState(true);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const enableCloseTimer = setTimeout(() => {
        setCanClose(true);
      }, CLOSE_DELAY);

      return () => clearTimeout(enableCloseTimer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setCanClose(false);

    const reappearTimer = setTimeout(() => {
      setIsVisible(true);
    }, REAPPEAR_DELAY);
    
    // Não é necessário limpar este timer, pois o componente será remontado ou o estado mudará
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full group">
       <div
          className={cn(
            "relative flex items-center gap-3 w-full rounded-lg bg-card/80 backdrop-blur-xl p-2 border border-border shadow-md transition-all duration-300 ease-in-out"
          )}
        >
        <Link href={ad.link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3">
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
            <p className={cn("text-xs text-muted-foreground truncate")}>{ad.description}</p>
          </div>
        </Link>
           <Badge variant={'secondary'} className={cn(
               'bg-secondary text-secondary-foreground text-xs'
           )}>
            Anúncio
          </Badge>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            disabled={!canClose}
            className="h-7 w-7 rounded-full absolute top-1 right-1 bg-black/30 hover:bg-black/50 disabled:bg-black/10 disabled:cursor-not-allowed"
            aria-label="Fechar anúncio"
            >
             <X className={cn("h-4 w-4 text-white", !canClose && "text-white/30")} />
          </Button>
        </div>
    </div>
  );
}
