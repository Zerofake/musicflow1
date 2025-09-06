import Image from 'next/image';
import Link from 'next/link';
import { playlists } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

export default function PlaylistsPage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Playlists</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <Link href={`/playlists/${playlist.id}`} key={playlist.id} className="group relative">
            <Card className="overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <Image
                    src={playlist.coverArt}
                    alt={`Capa da playlist ${playlist.name}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    data-ai-hint="music playlist cover"
                    priority={playlist.id === '1' || playlist.id === '2'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <h3 className="font-bold text-white">{playlist.name}</h3>
                    <p className="text-xs text-neutral-300">{playlist.songIds.length} músicas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-primary p-3 rounded-full shadow-lg">
                <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
