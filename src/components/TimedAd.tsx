"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { timedAds } from '@/lib/affiliate-ads';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useMusic } from '@/hooks/useMusic';

const AD_REAPPEAR_INTERVAL = 3 * 60 * 1000; // 3 minutos
const CLOSE_BUTTON_DELAY = 15 * 1000; // 15 segundos
const AD_ROTATION_INTERVAL = 10 * 1000; // 10 segundos para rotacionar

export function TimedAd() {
  const { isAdFree } = useMusic();
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const reappearTimer = useRef<NodeJS.Timeout | null>(null);

  const handleClose = () => {
    setIsVisible(false);
    setCanClose(false);
    localStorage.setItem('adLastClosedTime', new Date().getTime().toString());

    if (reappearTimer.current) {
      clearTimeout(reappearTimer.current);
    }

    reappearTimer.current = setTimeout(() => {
      setIsVisible(true);
    }, AD_REAPPEAR_INTERVAL);
  };

  useEffect(() => {
    const lastClosedTime = localStorage.getItem('adLastClosedTime');
    if (!lastClosedTime) {
      setIsVisible(true);
      return;
    }

    const now = new Date().getTime();
    const timeSinceClosed = now - Number(lastClosedTime);

    if (timeSinceClosed >= AD_REAPPEAR_INTERVAL) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      const timeUntilReappear = AD_REAPPEAR_INTERVAL - timeSinceClosed;
      if (reappearTimer.current) clearTimeout(reappearTimer.current);
      reappearTimer.current = setTimeout(() => setIsVisible(true), timeUntilReappear);
    }

    return () => {
      if (reappearTimer.current) clearTimeout(reappearTimer.current);
    };
  }, []);

  useEffect(() => {
    let closeTimer: NodeJS.Timeout | null = null;
    let rotationInterval: NodeJS.Timeout | null = null;

    if (isVisible) {
      setCanClose(false); 

      closeTimer = setTimeout(() => {
        setCanClose(true);
      }, CLOSE_BUTTON_DELAY);

      if (timedAds.length > 1) {
        rotationInterval = setInterval(() => {
          setCurrentAdIndex((prevIndex) => (prevIndex + 1) % timedAds.length);
        }, AD_ROTATION_INTERVAL);
      }
    }

    return () => {
      if (closeTimer) clearTimeout(closeTimer);
      if (rotationInterval) clearInterval(rotationInterval);
    };
  }, [isVisible]);

  if (!isVisible || timedAds.length === 0 || isAdFree) {
    return null;
  }

  const ad = timedAds[currentAdIndex];

  return (
    <div className="relative w-full mb-4">
        <div className="absolute top-1 right-1 z-20">
             <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                disabled={!canClose}
                className={cn(
                "h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full",
                !canClose && "cursor-not-allowed opacity-50"
                )}
                aria-label="Fechar anúncio"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
      <Link href={ad.link} target="_blank" rel="noopener noreferrer" className="block group">
        <div className="relative overflow-hidden rounded-lg aspect-[8/1] w-full bg-muted">
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover"
            data-ai-hint="advertisement banner"
            priority
          />
        </div>
      </Link>
    </div>
  );
}
