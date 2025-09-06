import { SmartPlaylistClient } from './client';

export default function SmartPlaylistPage() {
  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Playlist Inteligente</h1>
          <p className="text-muted-foreground mt-2">
            Descreva seus gostos musicais e crie uma playlist com sugestões da nossa IA.
          </p>
        </div>
        <SmartPlaylistClient />
      </div>
    </div>
  );
}
