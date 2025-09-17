import { createAudioResource } from '@discordjs/voice';
import type { IAudioResourceResolver } from './iAudioResourceResolver.js';
import { isValidUrl } from '../../../utils/url.js';
import path from 'node:path';

export class LocalAudioResourceResolver implements IAudioResourceResolver {
    private query: string;

    constructor(query: string) {
        this.query = query;
    }

    canHandle(): boolean {
        return !isValidUrl(this.query);
    }

    async createResource() {
        const filePath = path.resolve('./resources', `${this.query}.mp3`);
        // 2. Create audio resource
        return createAudioResource(filePath);
    }
}
