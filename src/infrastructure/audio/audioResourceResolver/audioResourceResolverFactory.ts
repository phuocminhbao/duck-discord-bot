import type { IAudioResourceResolver } from './iAudioResourceResolver.js';
import { LocalAudioResourceResolver } from './localAudioResourceResolver.js';
import { YoutubeAudioResourceResolver } from './youtubeAudioResourceResolver.js';

export class AudioResourceResolverFactory {
    static getResolver(query: string): IAudioResourceResolver {
        const local = new LocalAudioResourceResolver(query);
        const youtube = new YoutubeAudioResourceResolver(query);
        const resolver = [local, youtube].find((resolver) => resolver.canHandle());
        if (!resolver) {
            throw new Error('Cannot find any appropriate audio resolver');
        }
        return resolver;
    }
}
