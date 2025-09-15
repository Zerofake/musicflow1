"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AffiliateAd } from '@/lib/affiliate-ads';

const ad = {
    link: 'https://s.click.aliexpress.com/e/_oorQon3?bz=300*250',
    imageUrl: 'https://ae-pic-a1.aliexpress-media.com/kf/S2a797cbd3a004b5cb4f0897b2793cb9ef.png'
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
            "relative w-full rounded-lg bg-card/80 backdrop-blur-xl p-0 border border-border shadow-md transition-all duration-300 ease-in-out"
          )}
        >
        <Link href={ad.link} target="_blank" rel="noopener noreferrer" className="block w-full h-[90px] relative overflow-hidden rounded-lg">
            <Image
              src={ad.imageUrl}
              alt="Anúncio de afiliado"
              width={725}
              height={90}
              className="object-cover w-full h-full"
              data-ai-hint="advertisement banner"
              priority
            />
        </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            disabled={!canClose}
            className="h-7 w-7 rounded-full absolute top-1 right-1 bg-black/40 hover:bg-black/60 disabled:bg-black/20 disabled:cursor-not-allowed"
            aria-label="Fechar anúncio"
            >
             <X className={cn("h-4 w-4 text-white", !canClose && "text-white/40")} />
          </Button>
        </div>
    </div>
  );
}
