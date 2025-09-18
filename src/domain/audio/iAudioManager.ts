export interface IAudioManager {
    join(channel: string): Promise<void>;
    leave(): Promise<void>;

    play(isSkip: boolean): void;
    playNow(): Promise<void>;
    pause(): void;
    resume(): void;
    stop(): void;

    addToQueue(): Promise<void>;
    skip(): void;
    clearQueue(): void;

    get queueNames(): string[];
    get currentAudioName(): string | undefined;
}
