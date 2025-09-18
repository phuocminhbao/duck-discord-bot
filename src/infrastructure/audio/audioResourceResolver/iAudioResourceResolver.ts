import type { AudioResource } from '@discordjs/voice';

export interface IAudioResourceResolver {
    canHandle(): boolean;

    createResource(): AudioResource | Promise<AudioResource>;

    get audioName(): string;
}
