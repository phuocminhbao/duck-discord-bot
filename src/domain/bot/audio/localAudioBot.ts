import type { IAudioBot } from './iAudioBot.js';

export class LocalAudioBot implements IAudioBot {
    play(): void {
        throw new Error('Method not implemented.');
    }
}
