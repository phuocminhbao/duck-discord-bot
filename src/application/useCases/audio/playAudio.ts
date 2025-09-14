import type { IAudioManager } from '../../../domain/audio/iAudioManager.js';

export class PlayAudio {
    private audioManager: IAudioManager;

    constructor(audioManager: IAudioManager) {
        this.audioManager = audioManager;
    }

    executeInChannel(channelId: string) {
        this.audioManager.join(channelId);
        this.audioManager.addToQueue();
        this.audioManager.play();
    }
}
