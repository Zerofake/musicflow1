import { songs } from '@/lib/data';
import { SongItem } from '@/components/SongItem';

export default function AllSongsPage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Todas as Músicas</h1>
      <div className="space-y-2">
        {songs.map((song) => (
          <SongItem key={song.id} song={song} playlistSongs={songs} />
        ))}
      </div>
    </div>
  );
}
