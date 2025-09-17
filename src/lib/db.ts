
import Dexie, { type Table } from 'dexie';
import type { Song, Playlist, UserData } from './types';

export class MusicFlowDB extends Dexie {
  songs!: Table<Song, string>; // Primary key is string (id)
  playlists!: Table<Playlist, string>; // Primary key is string (id)
  userData!: Table<UserData, string>; // Primary key is string ('main')

  constructor() {
    super('MusicFlowDB_v2'); // Renamed to force a clean slate
    // Version 1 for the new DB name
    this.version(1).stores({
      songs: 'id, title, artist, album',
      playlists: 'id, name',
      userData: 'id',
    });
  }
}

export const db = new MusicFlowDB();
