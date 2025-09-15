
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { timedAds } from '@/lib/affiliate-ads';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const AD_REAPPEAR_INTERVAL = 3 * 60 * 1000; // 3 minutos
const CLOSE_BUTTON_DELAY = 15 * 1000; // 15 segundos
const AD_ROTATION_INTERVAL = 10 * 1000; // 10 segundos para rotacionar

export function TimedAd() {
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const reappearTimer = useRef<NodeJS.Timeout | null>(null);

  // Efeito para mostrar o anúncio inicial e configurar o reaparecimento
  useEffect(() => {
    const showAd = () => {
      const lastClosedTime = localStorage.getItem('adLastClosedTime');
      const now = new Date().getTime();

      if (!lastClosedTime || (now - Number(lastClosedTime) > AD_REAPPEAR_INTERVAL)) {
        setIsVisible(true);
        setCanClose(false); // Reseta a permissão para fechar
      } else {
        // Se não for para mostrar, agenda a próxima verificação
        const timeUntilReappear = AD_REAPPEAR_INTERVAL - (now - Number(lastClosedTime));
        if (reappearTimer.current) clearTimeout(reappearTimer.current);
        reappearTimer.current = setTimeout(showAd, timeUntilReappear);
      }
    };
    
    showAd(); // Mostra o anúncio na primeira vez que o componente carrega

    return () => {
      if (reappearTimer.current) clearTimeout(reappearTimer.current);
    };
  }, []);

  // Efeito para habilitar o botão de fechar após 15 segundos
  useEffect(() => {
    let closeTimer: NodeJS.Timeout;
    if (isVisible) {
      closeTimer = setTimeout(() => {
        setCanClose(true);
      }, CLOSE_BUTTON_DELAY);
    }
    return () => clearTimeout(closeTimer);
  }, [isVisible]);


  // Efeito para rotacionar os anúncios
  useEffect(() => {
    if (!isVisible || timedAds.length <= 1) return;

    const rotationInterval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % timedAds.length);
    }, AD_ROTATION_INTERVAL);

    return () => clearInterval(rotationInterval);
  }, [isVisible]);

  const handleClose = () => {
    if (canClose) {
      setIsVisible(false);
      localStorage.setItem('adLastClosedTime', new Date().getTime().toString());
      
      // Agenda a próxima verificação para reaparecimento
      if (reappearTimer.current) clearTimeout(reappearTimer.current);
      reappearTimer.current = setTimeout(() => setIsVisible(true), AD_REAPPEAR_INTERVAL);
    }
  };

  if (!isVisible || timedAds.length === 0) {
    return null;
  }

  const ad = timedAds[currentAdIndex];

  return (
    <div className="relative w-full mb-4 group">
      <Link href={ad.link} target="_blank" rel="noopener noreferrer">
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            width={725}
            height={90}
            className="object-cover w-full h-auto"
            data-ai-hint="advertisement banner"
          />
        </div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        disabled={!canClose}
        className={cn(
          "absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full z-10",
          !canClose && "cursor-not-allowed opacity-50"
        )}
        aria-label="Fechar anúncio"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
