import type { Client } from 'discord.js';
import type { BotEvent } from '../types/botEvent.js';

import { logger } from '../infrastructure/logger/logger.js';
import { forEachModule, SUB_SRC_PATH } from '../utils/moduleImport.js';

/**
 * Dynamically loads all event files in src/eventLoader/events.
 */
export const loadEvents = async (client: Client): Promise<void> => {
    try {
        await forEachModule(SUB_SRC_PATH.EVENTS, (module) => {
            const event = module as BotEvent;
            const { name, action, execute } = event;
            client[action](name, execute as never);
            logger.info(`Loaded event: ${name}`);
        });
    } catch (e) {
        logger.error(`Something wrong when loading events, error: ${(e as Error).message}`);
    }
};
