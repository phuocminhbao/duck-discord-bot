import type { ChatInputCommandInteraction } from 'discord.js';
import { logger } from '../../infrastructure/logger/logger.js';

export class PingUseCase {
    private chatInteraction: ChatInputCommandInteraction;

    constructor(chatInteraction: ChatInputCommandInteraction) {
        this.chatInteraction = chatInteraction;
    }

    async execute() {
        const { interaction } = await this.chatInteraction.reply('Ping con cak?');
        logger.info({ user: this.chatInteraction.user.tag }, `Replied`);
        return interaction;
    }
}
