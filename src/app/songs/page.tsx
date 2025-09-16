"use client";

import { useMusic } from '@/hooks/useMusic';
import { SongItem } from '@/components/SongItem';
import { Card, CardContent } from '@/components/ui/card';
import { Music } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AllSongsPage() {
  const { songs, isHydrated } = useMusic();

  if (!isHydrated) {
    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-3xl font-bold mb-6">Todas as Músicas</h1>
            <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        </div>
    );
  }
  
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Todas as Músicas</h1>
      {songs.length > 0 ? (
        <div className="space-y-2">
            {songs.map((song) => (
            <SongItem key={song.id} song={song} playlistSongs={songs} />
            ))}
        </div>
        ) : (
        <Card className="mt-8 bg-muted/30 border-dashed">
            <CardContent className="p-6 text-center">
                <Music className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold">Nenhuma música encontrada</h3>
                <p className="text-sm text-muted-foreground mt-1">Vá para Adicionar para importar músicas do seu dispositivo.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
