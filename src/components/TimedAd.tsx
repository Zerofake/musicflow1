
"use client";

import React, { useState, useEffect } from 'react';
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
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const lastClosedTime = localStorage.getItem('adLastClosedTime');
    const now = new Date().getTime();

    if (!lastClosedTime || (now - Number(lastClosedTime) > AD_REAPPEAR_INTERVAL)) {
      setIsVisible(true);
    }

    const reappearInterval = setInterval(() => {
        setIsVisible(true);
    }, AD_REAPPEAR_INTERVAL);
    
    return () => clearInterval(reappearInterval);

  }, []);

  useEffect(() => {
    let closeTimer: NodeJS.Timeout;
    if (isVisible) {
      setCanClose(false);
      setShowCloseButton(false);
      closeTimer = setTimeout(() => {
        setCanClose(true);
        setShowCloseButton(true);
      }, CLOSE_BUTTON_DELAY);
    }
    return () => clearTimeout(closeTimer);
  }, [isVisible]);


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
      {showCloseButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          disabled={!canClose}
          className={cn(
            "absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full z-10",
            !canClose && "cursor-not-allowed opacity-50"
          )}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
