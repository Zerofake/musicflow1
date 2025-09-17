
import Dexie, { type Table } from 'dexie';
import type { Song, Playlist, UserData } from './types';
import { initialSongs } from './data';

export class MusicFlowDB extends Dexie {
  songs!: Table<Song, string>; // Primary key is string (id)
  playlists!: Table<Playlist, string>; // Primary key is string (id)
  userData!: Table<UserData, string>; // Primary key is string ('main')

  constructor() {
    super('MusicFlowDB');
    // Version 5: Removes onpopulate to handle seeding in the provider, fixing persistent data issues.
    this.version(5).stores({
      songs: 'id, title, artist, album',
      playlists: 'id, name',
      userData: 'id',
    });
  }
}

export const db = new MusicFlowDB();
