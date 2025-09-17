import type { AudioPlayer } from '@discordjs/voice';
import {
    AudioPlayerStatus,
    createAudioPlayer,
    entersState,
    joinVoiceChannel,
    VoiceConnectionStatus,
    type AudioResource,
    type VoiceConnection,
} from '@discordjs/voice';
import type { IAudioManager } from '../../domain/audio/iAudioManager.js';
import type { Guild } from 'discord.js';
import { logger } from '../logger/logger.js';
import type { IAudioResourceResolver } from './audioResourceResolver/iAudioResourceResolver.js';

export class AudioManager implements IAudioManager {
    private guild: Guild;
    private voiceConnection?: VoiceConnection;
    private audioPlayer: AudioPlayer;
    private queue: AudioResource[];
    private resourceResolver?: IAudioResourceResolver;

    constructor(guild: Guild) {
        this.guild = guild;
        this.audioPlayer = createAudioPlayer();
        this.onAudioPlayerStatusChange();
        this.queue = [];
    }

    async join(channelId: string): Promise<void> {
        if (this.voiceConnection) {
            return;
        }
        this.voiceConnection = joinVoiceChannel({
            channelId,
            guildId: this.guild.id,
            adapterCreator: this.guild.voiceAdapterCreator,
        });
        this.onVoiceConnectionChange();
        await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20_000);
        this.voiceConnection.subscribe(this.audioPlayer);
    }

    async leave(): Promise<void> {
        if (!this.voiceConnection) {
            return;
        }
        this.audioPlayer.stop();
        this.voiceConnection?.destroy();
        this.voiceConnection = undefined;
    }

    play() {
        if (this.status === AudioPlayerStatus.Playing) {
            return;
        }
        const resource = this.queue.shift();
        if (!resource) {
            logger.warn('No audio left in the queue');
            return;
        }
        this.audioPlayer.play(resource);
    }

    playNow(): void {
        throw new Error('Method not implemented.');
    }

    pause(): void {
        throw new Error('Method not implemented.');
    }

    resume(): void {
        throw new Error('Method not implemented.');
    }

    stop(): void {
        throw new Error('Method not implemented.');
    }

    async addToQueue() {
        if (!this.resourceResolver) {
            throw new Error('Resource Resolver is null');
        }
        const resource = await this.resourceResolver.createResource();
        this.queue.push(resource);
    }

    setResourceResolver(resourceResolver: IAudioResourceResolver) {
        this.resourceResolver = resourceResolver;
    }

    skip(): void {
        throw new Error('Method not implemented.');
    }

    clearQueue(): void {
        throw new Error('Method not implemented.');
    }

    get status() {
        return this.audioPlayer.state.status;
    }

    private onAudioPlayerStatusChange() {
        this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
            logger.info(`▶️ Now playing`);
        });

        this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            logger.info('⏹️ Playback finished');
            this.play();
        });

        this.audioPlayer.on('error', (error) => {
            logger.error(error, 'Audio player error');
        });
    }

    private onVoiceConnectionChange() {
        this.voiceConnection?.on(VoiceConnectionStatus.Disconnected, () => {
            logger.info('Bot get kicked');
            this.leave();
        });
    }
}
