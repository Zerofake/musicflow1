"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMusic } from '@/hooks/useMusic';

const messages = [
  { lang: 'pt', text: 'Doação PIX: onlupy@gmail.com', duration: 10000 },
  { lang: 'en', text: 'PIX Donation: onlupy@gmail.com', duration: 5000 },
  { lang: 'ru', text: 'Пожертвование PIX: onlupy@gmail.com', duration: 5000 },
];

export function PixDonation() {
  const { isAdFree } = useMusic();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const message = messages[currentMessageIndex];
    const timer = setTimeout(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, message.duration);

    return () => clearTimeout(timer);
  }, [currentMessageIndex]);

  if (isAdFree) {
    return null;
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative flex items-center justify-center w-full rounded-lg bg-card/80 backdrop-blur-xl p-2 border border-border shadow-md animate-pulse"
        )}
      >
        <p className="font-semibold text-xs sm:text-sm text-center text-foreground">{messages[currentMessageIndex].text}</p>
      </div>
    </div>
  );
}
