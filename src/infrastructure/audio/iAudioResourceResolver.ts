import type { AudioResource } from '@discordjs/voice';

export interface IAudioResourceResolver {
    /**
     * Check if this bot can handle the query
     */
    canHandle(): boolean;

    /**
     * Create an AudioResource ready for playback
     */
    createResource(): AudioResource;
}
