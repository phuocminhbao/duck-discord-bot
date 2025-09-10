import { DuckSlashCommandBuilder } from '../infrastructure/extension/builders/DuckSlashCommandBuilder.js';
import { logger } from '../infrastructure/logger/logger.js';
import type { BotCommand } from '../types/botCommand.js';

export const ping: BotCommand = {
    data: new DuckSlashCommandBuilder().setName('ping').setDescription('Reply on /ping'),
    execute: async (chatInteraction) => {
        const { interaction } = await chatInteraction.reply('Ping con cak?');
        logger.info({ user: chatInteraction.user.tag }, `Replied`);
        return interaction;
    },
};
