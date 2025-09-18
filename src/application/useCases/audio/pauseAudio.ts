import type { IAudioManager } from '../../../domain/audio/iAudioManager.js';
import { AudioUseCase } from './audioUseCase.js';

export class PauseAudio extends AudioUseCase {
    constructor(audioManager: IAudioManager) {
        super(audioManager);
    }

    execute() {
        this.audioManager.pause();
    }
}
