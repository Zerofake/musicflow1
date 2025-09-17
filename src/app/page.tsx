"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Plus, Info, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreatePlaylistDialog } from '@/components/CreatePlaylistDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TimedAd } from '@/components/TimedAd';

export default function PlaylistsPage() {
  const { playlists, canCreatePlaylist, isHydrated } = useMusic();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreatePlaylistClick = () => {
    if (canCreatePlaylist.can) {
      setDialogOpen(true);
    }
  }

  const CreateButton = () => {
    const button = (
      <Button
        onClick={handleCreatePlaylistClick}
        disabled={!isHydrated || !canCreatePlaylist.can}
        size="sm"
      >
        <Plus className="mr-2 h-4 w-4" /> Criar Playlist
      </Button>
    );

    if (isHydrated && !canCreatePlaylist.can) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* O div wrapper é necessário para o tooltip funcionar em um botão desabilitado */}
              <div className="inline-block cursor-not-allowed">
                {button}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{canCreatePlaylist.message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  return (
    <div className="p-4 sm:p-6">
      <TimedAd />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Playlists</h1>
      </div>

      <div className="flex justify-between items-center mb-6 mt-4">
          <h2 className="text-xl font-semibold">Suas Playlists</h2>
          <CreateButton />
      </div>

      <CreatePlaylistDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      
      {playlists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <Link href={`/playlists/${playlist.id}`} key={playlist.id} className="group relative">
              <Card className="overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors">
                <CardContent className="p-0">
                  <div className="aspect-square relative bg-muted flex items-center justify-center">
                    {playlist.coverArt ? (
                        <Image
                        src={playlist.coverArt}
                        alt={`Capa da playlist ${playlist.name}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        data-ai-hint="music playlist cover"
                        priority={playlist.id === '1' || playlist.id === '2'}
                        />
                    ) : (
                        <Music className="h-12 w-12 text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-3">
                      <h3 className="font-bold text-white">{playlist.name}</h3>
                      <p className="text-xs text-neutral-300">{(playlist.songs && playlist.songs.length) || 0} músicas</p>
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
      ) : (
        <Card className="mt-8 bg-muted/30 border-dashed">
            <CardContent className="p-6 text-center">
                <Info className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold">Nenhuma playlist encontrada</h3>
                <p className="text-sm text-muted-foreground mt-1">Crie sua primeira playlist para começar a organizar suas músicas.</p>
            </CardContent>
        </Card>
      )}

      <Card className="mt-8 bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
                <h4 className="font-semibold text-sm">Informações</h4>
                <ul className="list-disc list-inside text-xs text-muted-foreground mt-2 space-y-1">
                    <li>Você pode criar até 12 playlists gratuitas.</li>
                    <li>Todas as suas músicas e playlists são salvas localmente no seu dispositivo.</li>
                </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
