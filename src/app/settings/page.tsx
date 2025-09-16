"use client";

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/hooks/useMusic';
import type { Song } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderUp, Loader2, Music, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function SettingsPage() {
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
            audio.src = URL.createObjectURL(file);
            audio.onloadedmetadata = () => {
                resolve(audio.duration);
                URL.revokeObjectURL(audio.src);
            };
            audio.onerror = () => {
                resolve(0); // Could not determine duration
                URL.revokeObjectURL(audio.src);
            }
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
            
            const duration = await getAudioDuration(file);

            const newSong: Song = {
                id: `${file.name}-${file.lastModified}`, // Create a semi-unique ID
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                artist: 'Desconhecido',
                album: 'Importado',
                duration: duration,
                audioSrc: URL.createObjectURL(file), // This only works while the app is open
            };
            newSongs.push(newSong);

            setFilesProcessed(i + 1);
            setProgress(((i + 1) / files.length) * 100);
        }

        if (newSongs.length > 0) {
            addSongs(newSongs);
            toast({
                title: "Músicas Importadas!",
                description: `${newSongs.length} novas músicas foram adicionadas à sua biblioteca.`,
            });
        }
        
        // Reset after a delay
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        // Reset file input to allow selecting the same file again
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-3xl font-bold mb-6">Ajustes</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Importar Músicas</CardTitle>
                    <CardDescription>
                        Adicione músicas do seu dispositivo à biblioteca do Music Flow.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isLoading ? (
                         <Button onClick={handleImportClick} className="w-full">
                            <FolderUp className="mr-2 h-4 w-4" />
                            Selecionar Arquivos de Áudio
                        </Button>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-center">
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
                    )}
                   
                    <input
                        type="file"
                        accept="audio/*"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        <Music className="inline-block h-3 w-3 mr-1" />
                        Os arquivos de áudio selecionados serão copiados para o armazenamento interno do aplicativo.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
