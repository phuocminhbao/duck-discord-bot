export interface IAudioManager {
    play(query: string): Promise<void>;
    pause(): void;
    resume(): void;
    skip(): void;
    leave(): void;
}
