"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Wand2 } from 'lucide-react';
import { getSuggestions } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { SuggestSongsOutput } from '@/ai/flows/smart-playlist-suggestions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  playlistName: z.string().min(3, { message: 'O nome da playlist deve ter pelo menos 3 caracteres.' }),
  listeningHistory: z.string().min(20, { message: 'Descreva seus gostos com pelo menos 20 caracteres.' }),
});

export function SmartPlaylistClient() {
  const [suggestions, setSuggestions] = useState<SuggestSongsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playlistName: '',
      listeningHistory: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    const result = await getSuggestions(values);
    if (result.success) {
      setSuggestions(result.data!);
    } else {
      setError(result.error!);
    }
    setIsLoading(false);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gerador de Playlist</CardTitle>
          <CardDescription>Preencha os campos abaixo para receber sugestões de músicas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="playlistName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Playlist</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Foco Total na Academia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="listeningHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seus Gostos Musicais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Gosto de rock dos anos 80, pop dançante e um pouco de jazz para relaxar..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Gerar Sugestões
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions && (
        <div className="mt-8 animate-in fade-in-50">
          <h2 className="text-2xl font-bold mb-4">Sugestões para "{form.getValues('playlistName')}"</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Músicas Sugeridas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {suggestions.suggestedSongs.map((song, index) => (
                    <li key={index}>{song}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Justificativa da IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{suggestions.reasoning}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
