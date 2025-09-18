import type { IAudioManager } from '../../../domain/audio/iAudioManager.js';

export class AudioUseCase {
    protected audioManager: IAudioManager;

    constructor(audioManager: IAudioManager) {
        this.audioManager = audioManager;
    }
}
