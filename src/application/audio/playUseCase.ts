import type { IAudioManager } from '../../domain/audio/iAudioManager.js';

export class PlayUseCase {
    private audioManager: IAudioManager;

    constructor(audioManager: IAudioManager) {
        this.audioManager = audioManager;
    }

    execute(query: string) {
        this.audioManager.play(query);
    }
}
