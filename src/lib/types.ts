export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverArt?: string; // URL to image
  audioSrc: string; // URL to audio file
}

export interface Playlist {
  id: string;
  name:string;
  description: string;
  coverArt: string; // URL to image
  songs: Song[];
}

export interface UserData {
  id: 'main';
  coins: number;
  adFreeUntil: number | null;
}

    