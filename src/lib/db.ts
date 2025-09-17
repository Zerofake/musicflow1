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
    }).upgrade(async tx => {
      // This migration is for safety, in case old data structure exists.
      // It ensures playlist 'songs' are arrays of strings (IDs).
      const playlistsToMigrate = await tx.table('playlists').toArray();
      for (const p of playlistsToMigrate) {
        if (p.songs.length > 0 && typeof p.songs[0] === 'object') {
          // This is the old format where songs were objects. Convert to IDs.
          const songIds = p.songs.map((s: any) => s.id).filter(Boolean);
          await tx.table('playlists').update(p.id, { songs: songIds });
        }
      }
    });

     this.version(2).stores({
      songs: 'id, title, artist, album',
      playlists: '++id, name',
      userData: 'id',
    });
  }
}

export const db = new MusicFlowDB();

db.on('populate', async () => {
    // This function runs only once, when the database is first created.
    // It seeds the DB with initial data.
    await db.songs.bulkAdd(initialSongs);
    await db.playlists.bulkAdd(initialPlaylists as any);
    await db.userData.add({ id: 'main', coins: 0, adFreeUntil: null });
});
