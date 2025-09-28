"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

// Seu Smart Link do Adsterra
const ADSTERRA_SMART_LINK = 'https://www.revenuecpmgate.com/fi461ebw2?key=4923b4b5dfab1f9f5d90c382beb1b2e3';

export function AdsterraAd() {
  return (
    <div className="relative w-full mb-4">
      <Link href={ADSTERRA_SMART_LINK} target="_blank" rel="noopener noreferrer" className="block group">
        <Card className="relative overflow-hidden rounded-lg aspect-[8/1] w-full bg-muted border-primary/50 hover:border-primary transition-all">
          <Image
            src="https://picsum.photos/seed/ad1/800/100"
            alt="Anúncio especial"
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            data-ai-hint="advertisement banner"
            priority
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white font-bold text-lg drop-shadow-md">Confira nossa oferta especial!</p>
          </div>
        </Card>
      </Link>
    </div>
  );
}
