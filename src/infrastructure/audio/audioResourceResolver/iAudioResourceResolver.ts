import type { AudioResource } from '@discordjs/voice';

export interface IAudioResourceResolver {
    get audioName(): string;
    get nextSuggestResource(): { resolver: IAudioResourceResolver; query: string };
    canHandle(): boolean;
    createResource(): AudioResource | Promise<AudioResource>;
}
