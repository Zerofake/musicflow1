"use client";

import { useState } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Button } from '@/components/ui/button';
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

export function CreatePlaylistDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { createPlaylist, canCreatePlaylist } = useMusic();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (newName.length > 200) {
      setError('O nome da playlist não pode ter mais de 200 caracteres.');
    } else {
      setError('');
    }
    setName(newName);
  };
  
  const handleSubmit = () => {
    if (!name || name.length > 200) {
      setError('O nome é obrigatório e não pode exceder 200 caracteres.');
      return;
    }
    const success = createPlaylist(name, description);
    if (success) {
      setName('');
      setDescription('');
      setError('');
      onOpenChange(false);
    }
  };

  const getButtonText = () => {
    if (canCreatePlaylist.needsCredits) {
      return `Criar (Custo: 25 créditos)`;
    }
    return "Criar Playlist";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Playlist</DialogTitle>
          <DialogDescription>
            {canCreatePlaylist.message}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              className="col-span-3"
              placeholder="Minha playlist de rock"
              maxLength={200}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="As melhores do rock clássico!"
            />
          </div>
          {error && <p className="col-span-4 text-destructive text-sm text-center">{error}</p>}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancelar
                </Button>
            </DialogClose>
          <Button onClick={handleSubmit} disabled={!canCreatePlaylist.can || !!error}>
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
