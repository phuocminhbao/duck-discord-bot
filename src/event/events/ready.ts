import type { Client } from 'discord.js';
import { Events } from 'discord.js';
import { logger } from '../../logger/logger.js';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        logger.info(`Logged in as ${client.user?.tag}`);
    },
};
