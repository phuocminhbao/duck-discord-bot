import type { IAudioBot } from './iAudioBot.js';

class LocalAudioBot implements IAudioBot {
    play(): void {
        throw new Error('Method not implemented.');
    }
}
