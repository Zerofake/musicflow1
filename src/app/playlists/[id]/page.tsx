
"use client";

import Image from 'next/image';
import { notFound, useRouter, useParams } from 'next/navigation';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { SongItem } from '@/components/SongItem';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Song } from '@/lib/types';

export default function PlaylistDetailPage() {
  const params = useParams();
  const { playlists, songs, deletePlaylist, updatePlaylist } = useMusic();
  const router = useRouter();
  const playlist = playlists.find((p) => p.id === params.id);
  
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (playlist) {
      const mappedSongs = playlist.songIds
        .map((songId) => songs.find((s) => s.id === songId))
        .filter(Boolean) as Song[];
      setPlaylistSongs(mappedSongs);
    }
  }, [playlist, songs]);

  const dragItem = useRef<string | null>(null);
  const dragOverItem = useRef<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, songId: string) => {
    dragItem.current = songId;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, songId: string) => {
    dragOverItem.current = songId;
  };

  const handleDragEnd = () => {
    if (dragItem.current && dragOverItem.current && dragItem.current !== dragOverItem.current && typeof params.id === 'string') {
      const newSongIds = [...(playlist?.songIds || [])];
      const dragItemIndex = newSongIds.indexOf(dragItem.current);
      const dragOverItemIndex = newSongIds.indexOf(dragOverItem.current);
      
      const [removed] = newSongIds.splice(dragItemIndex, 1);
      newSongIds.splice(dragOverItemIndex, 0, removed);
      
      updatePlaylist(params.id, { songIds: newSongIds });
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  if (!playlist) {
    notFound();
  }
  
  const handleDeletePlaylist = () => {
    if (typeof params.id === 'string') {
        deletePlaylist(params.id);
        router.push('/');
    }
  };

  return (
    <div>
      <div className="relative h-60 w-full">
        <Image
          src={playlist.coverArt}
          alt={`Capa da playlist ${playlist.name}`}
          fill
          className="object-cover"
          data-ai-hint="music playlist cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-black/30 backdrop-blur-sm">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Excluir playlist</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-6">
          <p className="text-sm font-medium">Playlist</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">{playlist.name}</h1>
          <p className="text-muted-foreground mt-2">{playlist.description}</p>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="space-y-1">
          {playlistSongs.length > 0 ? (
            playlistSongs.map((song) => (
              <SongItem 
                key={song.id} 
                song={song}
                playlistSongs={playlistSongs}
                playlistId={typeof params.id === 'string' ? params.id : undefined}
                draggable
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Esta playlist está vazia. Adicione músicas na tela "Todas as Músicas".
            </p>
          )}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente a playlist '{playlist.name}'.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlaylist} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
