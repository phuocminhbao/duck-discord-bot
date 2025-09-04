import type { BotCommand } from '../../type.js';
import { logger } from '../../logger/logger.js';
import { DuckSlashCommandBuilder } from '../duckSlashBuilder/DuckSlashCommandBuilder.js';

export const ping: BotCommand = {
    data: new DuckSlashCommandBuilder().setName('ping').setDescription('Reply on /ping'),
    execute: async (chatInteraction) => {
        const { interaction: sentInteraction } = await chatInteraction.reply({
            content: 'Ping con cak?',
            withResponse: true,
        });
        logger.info({ user: chatInteraction.user.tag }, `Replied`);
        return sentInteraction;
    },
};
