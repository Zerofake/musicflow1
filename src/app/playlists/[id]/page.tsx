import Image from 'next/image';
import { notFound } from 'next/navigation';
import { playlists, songs } from '@/lib/data';
import { SongItem } from '@/components/SongItem';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export default function PlaylistDetailPage({ params }: { params: { id: string } }) {
  const playlist = playlists.find((p) => p.id === params.id);

  if (!playlist) {
    notFound();
  }

  const playlistSongs = playlist.songIds.map((songId) => songs.find((s) => s.id === songId)).filter(Boolean) as any[];

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
        <div className="absolute bottom-0 left-0 p-4 sm:p-6">
          <p className="text-sm font-medium">Playlist</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">{playlist.name}</h1>
          <p className="text-muted-foreground mt-2">{playlist.description}</p>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="space-y-2">
          {playlistSongs.length > 0 ? (
            playlistSongs.map((song) => (
              <SongItem key={song.id} song={song} playlistSongs={playlistSongs} />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Esta playlist está vazia.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
