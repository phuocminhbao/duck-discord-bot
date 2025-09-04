import { readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Client } from 'discord.js';
import { logger } from '../../logger/logger.js';
import type { BotEvent } from '../../type.js';

/**
 * Dynamically loads all event files in src/eventLoader/events.
 */
export const loadEvents = async (client: Client): Promise<void> => {
    try {
        const eventsPath = path.join(process.cwd(), 'src', 'event/events');
        const files = readdirSync(eventsPath);

        for (const file of files) {
            if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;

            const filePath = path.join(eventsPath, file);
            const fileUrl = pathToFileURL(filePath).href;

            const eventModule = await import(fileUrl);
            const event: BotEvent = eventModule.default ?? Object.values(eventModule)[0];

            if (event?.name && typeof event.execute === 'function') {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args));
                } else {
                    client.on(event.name, (...args) => event.execute(...args));
                }
                logger.info(`Loaded event: ${event.name}`);
            } else {
                logger.warn(`Invalid event skipped: ${file}`);
            }
        }
    } catch (e) {
        logger.error(`Something wrong when loading events, error: ${(e as Error).message}`);
    }
};
