import { createAudioResource } from '@discordjs/voice';
import type { IAudioResourceResolver } from './iAudioResourceResolver.js';
import { logger } from '../../logger/logger.js';
import ytdl from '@distube/ytdl-core';

// preferred itags for Opus audio (highest → lowest)
const preferredAudioItags = [251, 250, 249];

/**
 * Pick the best available Opus audio stream (for Discord playback).
 */
export function selectBestAudioStream(formats: ytdl.videoFormat[]): ytdl.videoFormat | null {
    // filter only opus audio
    const audioFormats = formats.filter((f) => f.mimeType?.includes('audio/webm; codecs="opus"'));

    // try to find best itag in preferred order
    for (const itag of preferredAudioItags) {
        const match = audioFormats.find((f) => f.itag === itag);
        if (match) return match;
    }

    // fallback: pick highest bitrate available
    return audioFormats.sort((a, b) => (b.audioBitrate ?? 0) - (a.audioBitrate ?? 0))[0] || null;
}

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

        const streamUrl = selectBestAudioStream(info.formats)?.url;
        const streamResource = await fetch(streamUrl ?? '');
        // Wrap it into a Discord AudioResource
        return createAudioResource(streamResource.body as any);
    }
}
