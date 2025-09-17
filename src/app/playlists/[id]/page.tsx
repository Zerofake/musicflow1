
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

export default function PlaylistDetailPage() {
  const params = useParams();
  const playlistId = typeof params.id === 'string' ? params.id : '';
  const { playlists, deletePlaylist, updatePlaylist, isHydrated } = useMusic();
  const router = useRouter();
  
  const playlist = playlists.find((p) => p.id.toString() === playlistId);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(playlist?.name || '');
  const [editedDescription, setEditedDescription] = useState(playlist?.description || '');
  
  useEffect(() => {
    if (playlist) {
      setEditedName(playlist.name);
      setEditedDescription(playlist.description || '');
    }
  }, [playlist]);

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
      const newSongs = [...(playlist?.songs || [])];
      const dragItemIndex = newSongs.findIndex(s => s.id === dragItem.current);
      const dragOverItemIndex = newSongs.findIndex(s => s.id === dragOverItem.current);
      
      const [removed] = newSongs.splice(dragItemIndex, 1);
      newSongs.splice(dragOverItemIndex, 0, removed);
      
      updatePlaylist(playlistId, { songs: newSongs });
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };
  
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

  if (!isHydrated) {
    return (
        <div>
            <div className="relative h-60 w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            </div>
        </div>
    );
  }

  if (!playlist) {
    return notFound();
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
          {playlist.songs && playlist.songs.length > 0 ? (
            playlist.songs.map((song) => (
              <SongItem 
                key={song.id} 
                song={song}
                playlistSongs={playlist.songs}
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

    