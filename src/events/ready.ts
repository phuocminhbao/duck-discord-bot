import { Events } from 'discord.js';
import { logger } from '../infrastructure/logger/logger.js';
import type { BotEvent } from '../types/botEvent.js';

const ready: BotEvent = {
    name: Events.ClientReady,
    action: 'once',
    execute: (client) => {
        logger.info(`Ready: ${client.user?.tag}`);
    },
};

export default ready;
