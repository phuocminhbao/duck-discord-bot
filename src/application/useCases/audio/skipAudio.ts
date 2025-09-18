import type { IAudioManager } from '../../../domain/audio/iAudioManager.js';
import { AudioUseCase } from './audioUseCase.js';

export class SkipAudioNow extends AudioUseCase {
    constructor(audioManager: IAudioManager) {
        super(audioManager);
    }

    execute() {
        this.audioManager.skip();
    }
}
