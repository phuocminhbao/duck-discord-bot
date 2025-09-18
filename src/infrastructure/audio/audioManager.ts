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

type Audio = {
    name: string;
    resource: AudioResource;
};

type AudioQueue = Audio[];

export class AudioManager implements IAudioManager {
    private guild: Guild;
    private voiceConnection?: VoiceConnection;
    private audioPlayer: AudioPlayer;
    private resourceResolver?: IAudioResourceResolver;
    private queue: AudioQueue;
    private currentAudio?: Audio;
    private EMPTY_QUEUE_LENGTH = 0;

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

    play(isSkip: boolean = false) {
        const isBusy = [AudioPlayerStatus.Playing, AudioPlayerStatus.Paused].includes(this.status);
        if (isBusy && !isSkip) {
            return;
        }
        const audio = this.queue.shift();
        this.playAudio(audio);
    }

    async playNow() {
        await this.addToQueue();
        const audio = this.queue.pop();
        this.playAudio(audio);
    }

    private playAudio(audio?: Audio) {
        if (!audio) {
            logger.warn('No audio left in the queue');
            return;
        }
        this.audioPlayer.play(audio.resource);
        this.currentAudio = audio;
    }

    pause(): void {
        this.audioPlayer.pause(true);
    }

    resume(): void {
        this.audioPlayer.unpause();
    }

    stop(): void {
        this.clearQueue();
        this.audioPlayer.stop();
    }

    async addToQueue() {
        if (!this.resourceResolver) {
            throw new Error('Resource Resolver is null');
        }
        const resource = await this.resourceResolver.createResource();
        const audioName = this.resourceResolver.audioName;
        this.queue.push({ name: audioName, resource });
    }

    setResourceResolver(resourceResolver: IAudioResourceResolver) {
        this.resourceResolver = resourceResolver;
    }

    skip(): void {
        if (this.queue.length === this.EMPTY_QUEUE_LENGTH) {
            this.stop();
            return;
        }
        this.play(true);
    }

    clearQueue(): void {
        this.queue = [];
    }

    get queueNames(): string[] {
        return this.queue.map((audio) => audio?.name);
    }
    get currentAudioName(): string | undefined {
        return this.currentAudio?.name;
    }

    private get status() {
        return this.audioPlayer.state.status;
    }

    private onAudioPlayerStatusChange() {
        this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
            logger.info(`▶️ Now playing: ${this.currentAudioName}`);
        });

        this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            logger.info('⏹️ Playback finished');
            this.play();
        });

        this.audioPlayer.on('error', (error) => {
            logger.error(error, 'Audio player error');
            this.play();
        });
    }

    private onVoiceConnectionChange() {
        this.voiceConnection?.on(VoiceConnectionStatus.Disconnected, () => {
            logger.info('Bot get kicked');
            this.leave();
        });
    }
}
