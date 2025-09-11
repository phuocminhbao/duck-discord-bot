// domain/audio/AudioBotFactory.ts

import type { IAudioBot } from './interfaces/iAudioBot.js';

export class AudioBotFactory {
    private bots: IAudioBot[];

    constructor(bots: IAudioBot[]) {
        this.bots = bots;
    }

    /**
     * Returns the first bot that can handle this query
     */
    getBot(query: string): IAudioBot | null {
        return this.bots.find((bot) => bot.canHandle(query)) ?? null;
    }
}
