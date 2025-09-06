'use server';

/**
 * @fileOverview Provides song suggestions for playlists based on user listening history.
 *
 * - suggestSongs - A function that suggests songs based on the user's listening history.
 * - SuggestSongsInput - The input type for the suggestSongs function.
 * - SuggestSongsOutput - The return type for the suggestSongs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSongsInputSchema = z.object({
  listeningHistory: z
    .string()
    .describe(
      'A detailed history of the user listening habits, including songs, artists, and genres they frequently listen to.'
    ),
  playlistName: z.string().describe('The name of the playlist to suggest songs for.'),
});
export type SuggestSongsInput = z.infer<typeof SuggestSongsInputSchema>;

const SuggestSongsOutputSchema = z.object({
  suggestedSongs: z
    .array(z.string())
    .describe('A list of suggested songs based on the listening history.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the song suggestions, explaining why each song is a good fit.'),
});
export type SuggestSongsOutput = z.infer<typeof SuggestSongsOutputSchema>;

export async function suggestSongs(input: SuggestSongsInput): Promise<SuggestSongsOutput> {
  return suggestSongsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSongsPrompt',
  input: {schema: SuggestSongsInputSchema},
  output: {schema: SuggestSongsOutputSchema},
  prompt: `You are a music expert. Given the user's listening history and the playlist name, suggest songs that would be a good fit for the playlist.

Listening History: {{{listeningHistory}}}
Playlist Name: {{{playlistName}}}

Consider the user's listening history and the playlist name to suggest songs that the user might enjoy. Provide a reasoning for each song suggestion.

Format your output as a JSON object with "suggestedSongs" and "reasoning" fields. The "suggestedSongs" field should be an array of song names. The "reasoning" field should explain why each song is a good fit for the playlist and the user's taste.
`,
});

const suggestSongsFlow = ai.defineFlow(
  {
    name: 'suggestSongsFlow',
    inputSchema: SuggestSongsInputSchema,
    outputSchema: SuggestSongsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
