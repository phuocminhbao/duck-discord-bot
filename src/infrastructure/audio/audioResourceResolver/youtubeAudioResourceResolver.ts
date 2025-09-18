import { createAudioResource } from '@discordjs/voice';
import type { IAudioResourceResolver } from './iAudioResourceResolver.js';
import ytdl from '@distube/ytdl-core';

export class YoutubeAudioResourceResolver implements IAudioResourceResolver {
    private query: string;
    private preferredAudioItags = [251, 250, 249];
    private resolvedAudioName?: string;

    constructor(query: string) {
        this.query = query;
    }

    get audioName(): string {
        return this.resolvedAudioName ?? this.query;
    }

    canHandle(): boolean {
        return ytdl.validateURL(this.query);
    }

    async createResource() {
        const info = await ytdl.getInfo(this.query);
        this.resolvedAudioName = info.videoDetails.title;
        const streamUrl = this.selectBestAudioStream(info.formats)?.url;
        const streamResource = await fetch(streamUrl ?? '');
        return createAudioResource(streamResource.body as any);
    }

    private selectBestAudioStream(formats: ytdl.videoFormat[]): ytdl.videoFormat {
        const audioFormats = formats.filter((format) =>
            format.mimeType?.includes('audio/webm; codecs="opus"'),
        );

        for (const itag of this.preferredAudioItags) {
            const match = audioFormats.find((f) => f.itag === itag);
            if (match) return match;
        }

        return audioFormats.sort((a, b) => (b.audioBitrate ?? 0) - (a.audioBitrate ?? 0))[0];
    }
}
