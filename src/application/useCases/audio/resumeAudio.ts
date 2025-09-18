import type { IAudioManager } from '../../../domain/audio/iAudioManager.js';
import { AudioUseCase } from './audioUseCase.js';

export class ResumeAudio extends AudioUseCase {
    constructor(audioManager: IAudioManager) {
        super(audioManager);
    }

    execute() {
        this.audioManager.resume();
    }
}
