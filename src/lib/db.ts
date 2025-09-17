import Dexie, { type Table } from 'dexie';
import type { Song, Playlist, UserData } from './types';
import { initialSongs } from './data';

export class MusicFlowDB extends Dexie {
  songs!: Table<Song, string>; // Primary key is string (id)
  playlists!: Table<Playlist, string>; // Primary key is string (id)
  userData!: Table<UserData, string>; // Primary key is string ('main')

  constructor() {
    super('MusicFlowDB');
    this.version(4).stores({
      songs: 'id, title, artist, album',
      playlists: 'id, name',
      userData: 'id',
    });
  }
}

export const db = new MusicFlowDB();

db.on('populate', async () => {
    await db.songs.bulkAdd(initialSongs);
    
    // As playlists iniciais precisam ter os IDs das musicas iniciais
    const initialPlaylists: Omit<Playlist, 'id'>[] = [
      {
        name: 'Downloads',
        description: 'Músicas baixadas recentemente.',
        coverArt: 'https://picsum.photos/seed/playlist1/500/500',
        songs: ['SoundHelix-Song-2'],
      },
      {
        name: 'Vibes de Academia',
        description: 'Para dar aquele gás no treino.',
        coverArt: 'https://picsum.photos/seed/playlist2/500/500',
        songs: [],
      },
    ];

    const playlistsWithIds = initialPlaylists.map(p => ({
      ...p,
      id: `playlist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    }));

    await db.playlists.bulkAdd(playlistsWithIds as any);
    await db.userData.add({ id: 'main', coins: 0, adFreeUntil: null });
});
