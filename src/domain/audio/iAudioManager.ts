export interface IAudioManager {
    get queueNames(): string[];
    get currentAudioName(): string | undefined;

    join(channel: string): Promise<void>;
    leave(): Promise<void>;

    play(isSkip: boolean): void;
    playNow(): Promise<void>;
    pause(): void;
    resume(): void;
    stop(): void;
    clearQueue(): void;
    addToQueue(): Promise<void>;
    skip(): Promise<void>;
}
