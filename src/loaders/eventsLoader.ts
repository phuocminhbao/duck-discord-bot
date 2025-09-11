import { logger } from '../infrastructure/logger/logger.js';
import { forEachModule, SUB_SRC_PATH } from '../utils/moduleImport.js';

/**
 * Dynamically loads all event files in src/eventLoader/events.
 */
export const loadEvents = async (): Promise<void> => {
    try {
        await forEachModule(SUB_SRC_PATH.EVENTS, true, (module) => {
            const loadEvent = module as () => void;
            loadEvent();
        });
    } catch (e) {
        logger.error(`Something wrong when loading events, error: ${(e as Error).message}`);
    }
};
