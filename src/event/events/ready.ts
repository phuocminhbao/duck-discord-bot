import type { Client } from 'discord.js';
import { Events } from 'discord.js';
import { logger } from '../../logger/logger.js';
import type { BotEvent } from '../../type.js';

const ready: BotEvent<Client> = {
    name: Events.ClientReady,
    action: 'once',
    execute: (client) => {
        logger.info(`Ready: ${client.user?.tag}`);
    },
};

export default ready;
