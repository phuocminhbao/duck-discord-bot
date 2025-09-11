import type { AudioResource } from '@discordjs/voice';
import type { IAudioBot } from '../../domain/bot/iAudioBot.js';
import { isValidUrl } from '../../utils/url.js';
import { resolve } from 'node:path';
export class LocalBot implements IAudioBot {
    private query: string;
    constructor(query: string) {
        this.query = query;
    }

    canHandle(): boolean {
        if (isValidUrl(this.query)) return false;
        return true;
    }

    findResource(): Promise<{ title: string; url: string }> {
        const filePath = resolve('./resources', `${this.query}.mp3`);
        return Promise.resolve({
            title: this.query,
            url: filePath,
        });
    }

    createResource(): Promise<AudioResource> {
        throw new Error('Method not implemented.');
    }
}
