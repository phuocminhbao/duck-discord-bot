import type { AudioResource } from '@discordjs/voice';

export interface IAudioBot {
    /**
     * Check if this bot can handle the query
     */
    canHandle(): boolean;

    /**
     * Find metadata (title, url, etc.) for the query
     */
    findResource(): Promise<{ title: string; url: string }>;

    /**
     * Create an AudioResource ready for playback
     */
    createResource(): Promise<AudioResource>;
}
