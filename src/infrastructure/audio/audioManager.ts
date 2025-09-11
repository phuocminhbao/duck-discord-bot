import type { IAudioManager } from '../../domain/audio/iAudioManager.js';
import type { IAudioBot } from '../../domain/bot/iAudioBot.js';

export class AudioManager implements IAudioManager {
    private audioBot: IAudioBot;
    constructor(audioBot: IAudioBot) {
        this.audioBot = audioBot;
    }
    play(query: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    pause(): void {
        throw new Error('Method not implemented.');
    }
    resume(): void {
        throw new Error('Method not implemented.');
    }
    skip(): void {
        throw new Error('Method not implemented.');
    }
    leave(): void {
        throw new Error('Method not implemented.');
    }
}
