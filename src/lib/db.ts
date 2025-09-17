import Dexie, { type Table } from 'dexie';
import type { Song, Playlist, UserData } from './types';
import { initialSongs, initialPlaylists } from './data';

export class MusicFlowDB extends Dexie {
  songs!: Table<Song>;
  playlists!: Table<Playlist>;
  userData!: Table<UserData>;

  constructor() {
    super('MusicFlowDB');
    this.version(2).stores({
      songs: '++id, title, artist, album',
      playlists: '++id, name',
      userData: '&id',
    });
  }
}

export const db = new MusicFlowDB();

db.on('populate', async () => {
    await db.songs.bulkAdd(initialSongs);
    await db.playlists.bulkAdd(initialPlaylists);
    await db.userData.add({ id: 'main', coins: 0, adFreeUntil: null });
});
