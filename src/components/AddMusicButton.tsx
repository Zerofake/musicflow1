"use client";

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/hooks/useMusic';
import type { Song } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { FolderUp, Loader2, Music, CheckCircle2, PlusCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

export function AddMusicButton() {
    const { addSongs } = useMusic();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [filesProcessed, setFilesProcessed] = useState(0);
    const [totalFiles, setTotalFiles] = useState(0);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const getAudioDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
            const audio = document.createElement('audio');
            const reader = new FileReader();
            reader.onload = (e) => {
                audio.src = e.target?.result as string;
                audio.onloadedmetadata = () => {
                    resolve(audio.duration);
                };
                audio.onerror = () => {
                    resolve(0); // Could not determine duration
                }
            };
            reader.readAsDataURL(file);
        });
    }

    const fileToDataUri = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target?.result as string);
            };
            reader.onerror = (e) => {
                reject(e);
            }
            reader.readAsDataURL(file);
        });
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            return;
        }

        setIsLoading(true);
        setTotalFiles(files.length);
        setFilesProcessed(0);
        setProgress(0);
        
        const newSongs: Song[] = [];
        const CHUNK_SIZE = 5;
        let processedCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('audio/')) {
                toast({
                    variant: "destructive",
                    title: "Arquivo Inválido",
                    description: `O arquivo "${file.name}" não é um áudio e foi ignorado.`,
                });
                setTotalFiles(prev => prev - 1);
                continue;
            }
            
            const [duration, audioSrc] = await Promise.all([
                getAudioDuration(file),
                fileToDataUri(file)
            ]);

            const newSong: Song = {
                id: `${file.name}-${file.lastModified}`, // Create a semi-unique ID
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                artist: 'Desconhecido',
                album: 'Importado',
                duration: duration,
                audioSrc: audioSrc,
            };
            newSongs.push(newSong);

            processedCount++;
            setFilesProcessed(processedCount);
            setProgress((processedCount / files.length) * 100);

            if ((i + 1) % CHUNK_SIZE === 0) {
                addSongs([...newSongs]);
                newSongs.length = 0; 
                await new Promise(resolve => setTimeout(resolve, 50)); 
            }
        }

        if (newSongs.length > 0) {
            addSongs(newSongs);
        }

        toast({
            title: "Importação Concluída!",
            description: `${processedCount} músicas foram processadas.`,
        });
        
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <button 
                onClick={handleImportClick} 
                className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Adicionar músicas"
            >
                <PlusCircle className="h-6 w-6" />
                <span className="text-xs font-medium">Adicionar</span>
            </button>
            <input
                type="file"
                accept="audio/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <Dialog open={isLoading} onOpenChange={setIsLoading}>
                <DialogContent className="max-w-xs" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="text-center">Importando Músicas</DialogTitle>
                        <DialogDescription className="text-center">
                            Aguarde enquanto suas músicas são processadas.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 text-center p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            {progress < 100 ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <p>Processando {filesProcessed} de {totalFiles}...</p>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <p>Concluído!</p>
                                </>
                            )}
                            
                        </div>
                        <Progress value={progress} className="w-full" />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
