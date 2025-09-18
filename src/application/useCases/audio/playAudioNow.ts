import type { IAudioManager } from '../../../domain/audio/iAudioManager.js';
import { AudioUseCase } from './audioUseCase.js';

export class PlayAudioNow extends AudioUseCase {
    constructor(audioManager: IAudioManager) {
        super(audioManager);
    }

    async executeInChannel(channelId: string) {
        await this.audioManager.join(channelId);
        await this.audioManager.playNow();
    }
}
