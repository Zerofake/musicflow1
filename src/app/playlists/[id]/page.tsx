
"use client";

import Image from 'next/image';
import { notFound, useRouter, useParams } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { SongItem } from '@/components/SongItem';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2, ArrowLeft, Edit } from 'lucide-react';
import { AddMusicToPlaylistButton } from '@/components/AddMusicToPlaylistButton';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
  } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Song } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function PlaylistDetailPage() {
  const params = useParams();
  const playlistId = typeof params.id === 'string' ? params.id : '';
  const { playlists, songs, deletePlaylist, updatePlaylist, isHydrated } = useMusic();
  const router = useRouter();
  
  const playlist = playlists.find((p) => p.id === playlistId);
  
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(playlist?.name || '');
  const [editedDescription, setEditedDescription] = useState(playlist?.description || '');
  
  useEffect(() => {
    if (playlist) {
      setEditedName(playlist.name);
      setEditedDescription(playlist.description || '');
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
    if (dragItem.current && dragOverItem.current && dragItem.current !== dragOverItem.current && playlistId) {
      const newSongIds = [...(playlist?.songIds || [])];
      const dragItemIndex = newSongIds.indexOf(dragItem.current);
      const dragOverItemIndex = newSongIds.indexOf(dragOverItem.current);
      
      const [removed] = newSongIds.splice(dragItemIndex, 1);
      newSongIds.splice(dragOverItemIndex, 0, removed);
      
      updatePlaylist(playlistId, { songIds: newSongIds });
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  if (!isHydrated) {
    return (
        <div>
            <div className="relative h-60 w-full">
                <Skeleton className="h-full w-full" />
                <div className="absolute top-4 left-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                 <div className="absolute top-4 right-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-12 w-48" />
                </div>
            </div>
            <div className="p-4 sm:p-6">
                <div className="flex justify-end mb-4">
                    <Skeleton className="h-9 w-36" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (!playlist) {
    notFound();
  }
  
  const handleDeletePlaylist = () => {
    if (playlistId) {
        deletePlaylist(playlistId);
        router.push('/');
    }
  };

  const handleEditPlaylist = () => {
    if (playlistId && editedName) {
        updatePlaylist(playlistId, { name: editedName, description: editedDescription });
        setIsEditDialogOpen(false);
    }
  }

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
        <div className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-black/30 backdrop-blur-sm">
                <ArrowLeft className="h-5 w-5" />
            </Button>
        </div>
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-black/30 backdrop-blur-sm">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar playlist</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Excluir playlist</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-6">
          <p className="text-sm font-medium text-foreground/80">Playlist</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">{playlist.name}</h1>
          {playlist.description && <p className="text-muted-foreground mt-2 text-sm">{playlist.description}</p>}
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="flex justify-end mb-4">
            <AddMusicToPlaylistButton playlistId={playlistId} />
        </div>
        <div className="space-y-1">
          {playlistSongs.length > 0 ? (
            playlistSongs.map((song) => (
              <SongItem 
                key={song.id} 
                song={song}
                playlistSongs={playlistSongs}
                playlistId={playlistId}
                draggable
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Esta playlist está vazia. Adicione músicas usando o botão acima.
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Playlist</DialogTitle>
            <DialogDescription>
              Altere o nome e a descrição da sua playlist.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="col-span-3"
                maxLength={200}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Input
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
              <DialogClose asChild>
                  <Button type="button" variant="secondary">
                      Cancelar
                  </Button>
              </DialogClose>
            <Button onClick={handleEditPlaylist} disabled={!editedName}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
