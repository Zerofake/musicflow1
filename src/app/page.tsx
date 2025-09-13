"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Plus, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreatePlaylistDialog } from '@/components/CreatePlaylistDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function PlaylistsPage() {
  const { playlists, canCreatePlaylist, addCredits, credits } = useMusic();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreatePlaylistClick = () => {
    if (canCreatePlaylist.can) {
      setDialogOpen(true);
    }
  }

  const createButtonTooltip = canCreatePlaylist.needsCredits && !canCreatePlaylist.can
    ? "Você atingiu o limite de playlists. Compre créditos para criar mais."
    : "Criar nova playlist";
  
  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Playlists</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border border-yellow-500/50 bg-yellow-500/10 rounded-full px-3 py-1">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="font-bold text-yellow-400">{credits}</span>
          </div>
          <Button onClick={() => addCredits(10)} size="sm" variant="outline">
            <Plus className="mr-1 h-4 w-4" /> Comprar Créditos
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Suas Playlists</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* O div wrapper é necessário para o tooltip funcionar em um botão desabilitado */}
                <div className="inline-block"> 
                  <Button onClick={handleCreatePlaylistClick} disabled={!canCreatePlaylist.can} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Criar Playlist
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{createButtonTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      </div>

      <CreatePlaylistDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <Link href={`/playlists/${playlist.id}`} key={playlist.id} className="group relative">
            <Card className="overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <Image
                    src={playlist.coverArt}
                    alt={`Capa da playlist ${playlist.name}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    data-ai-hint="music playlist cover"
                    priority={playlist.id === '1' || playlist.id === '2'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <h3 className="font-bold text-white">{playlist.name}</h3>
                    <p className="text-xs text-neutral-300">{playlist.songIds.length} músicas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-primary p-3 rounded-full shadow-lg">
                <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
