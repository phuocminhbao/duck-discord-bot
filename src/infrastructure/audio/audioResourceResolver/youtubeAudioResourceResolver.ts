import { createAudioResource, demuxProbe } from '@discordjs/voice';
import type { IAudioResourceResolver } from './iAudioResourceResolver.js';
import { logger } from '../../logger/logger.js';
import { Readable } from 'stream';
import ytdl from 'ytdl-core';

export class YoutubeAudioResourceResolver implements IAudioResourceResolver {
    private query: string;

    constructor(query: string) {
        this.query = query;
    }

    canHandle(): boolean {
        return true;
    }

    async createResource() {
        logger.info('a');
        // vi.savefrom.net
        const info = await ytdl.getInfo(this.query);

        const streamResource = ytdl(this.query);

        console.log('a');
        // const { stream: probedStream, type } = await demuxProbe(streamResource);

        // Wrap it into a Discord AudioResource
        return createAudioResource(streamResource);
    }
}
