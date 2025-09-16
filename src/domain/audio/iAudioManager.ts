export type AudioManagerStatus = 'idle' | 'playing' | 'paused';
export interface IAudioManager {
    join(channel: string): Promise<void>;
    leave(): Promise<void>;

    play(): void;
    playNow(): void;
    pause(): void;
    resume(): void;
    stop(): void;

    addToQueue(): Promise<void>;
    skip(): void;
    clearQueue(): void;

    // getQueue(): AudioTrack[];
    // getCurrentTrack(): AudioTrack | null;
    getStatus(): AudioManagerStatus;
}
