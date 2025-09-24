import type { IAudioManager } from '../../../domain/audio/iAudioManager.js';
import { AudioUseCase } from './audioUseCase.js';

export class SkipAudio extends AudioUseCase {
    constructor(audioManager: IAudioManager) {
        super(audioManager);
    }

    async execute() {
        await this.audioManager.skip();
    }
}
