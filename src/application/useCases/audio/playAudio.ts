import type { IAudioManager } from '../../../domain/audio/iAudioManager.js';

export class PlayAudio {
    private audioManager: IAudioManager;

    constructor(audioManager: IAudioManager) {
        this.audioManager = audioManager;
    }

    async executeInChannel(channelId: string) {
        await this.audioManager.join(channelId);
        await this.audioManager.addToQueue();
        this.audioManager.play();
    }
}
