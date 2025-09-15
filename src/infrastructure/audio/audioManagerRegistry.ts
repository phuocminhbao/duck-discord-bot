import { logger } from '../logger/logger.js';
import type { AudioManager } from './audioManager.js';

export class AudioManagerRegistry {
    private static _INSTANCE: AudioManagerRegistry;
    private registry: Record<string, AudioManager>;

    private constructor() {
        this.registry = {};
    }

    public static get INSTANCE(): AudioManagerRegistry {
        if (!this._INSTANCE) {
            this._INSTANCE = new AudioManagerRegistry();
        }
        return this._INSTANCE;
    }

    private getAudioManager(guildId: string): AudioManager {
        return this.registry[guildId];
    }

    private registerAudioManager(guildId: string, manager: AudioManager) {
        this.registry[guildId] = manager;
    }

    public unRegisterAudioManager(guildId: string) {
        delete this.registry[guildId];
    }

    public getOrRegisterAudioManager(
        guildId: string,
        createAudioManager: () => AudioManager,
    ): AudioManager {
        const existingAudioManager = this.getAudioManager(guildId);
        if (existingAudioManager) {
            logger.info(`Found audio manager for ${guildId}`);
            return existingAudioManager;
        }
        const audioManager = createAudioManager();
        this.registerAudioManager(guildId, audioManager);
        logger.info(`Create new audio manager for ${guildId}`);
        return this.getAudioManager(guildId);
    }
}
