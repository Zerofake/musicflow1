import Dexie, { type Table } from 'dexie';
import type { Song, Playlist, UserData } from './types';
import { initialSongs, initialPlaylists } from './data';

export class MusicFlowDB extends Dexie {
  songs!: Table<Song, string>; // Primary key is string (id)
  playlists!: Table<Playlist, number>; // Primary key is number (auto-incremented id)
  userData!: Table<UserData, string>; // Primary key is string ('main')

  constructor() {
    super('MusicFlowDB');
    this.version(3).stores({
      songs: 'id, title, artist, album',
      playlists: '++id, name',
      userData: 'id',
    });
  }
}

export const db = new MusicFlowDB();

db.on('populate', async () => {
    await db.songs.bulkAdd(initialSongs);
    
    // As playlists iniciais precisam ter os IDs das musicas iniciais
    const modifiedInitialPlaylists = initialPlaylists.map(p => {
        if (p.name === 'Downloads') {
            return { ...p, songs: ['SoundHelix-Song-2'] };
        }
        return p;
    });

    await db.playlists.bulkAdd(modifiedInitialPlaylists as any);
    await db.userData.add({ id: 'main', coins: 0, adFreeUntil: null });
});
