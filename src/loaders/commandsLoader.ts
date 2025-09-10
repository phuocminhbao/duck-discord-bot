import type { BotCommand } from '../types/botCommand.js';

import { logger } from '../infrastructure/logger/logger.js';
import { forEachModule, SUB_SRC_PATH } from '../utils/moduleImport.js';

/**
 * Dynamically loads all command files in src/commands.
 */
export const loadCommands = async (): Promise<Record<string, BotCommand>> => {
    const commandsMap: Record<string, BotCommand> = {};
    try {
        await forEachModule(SUB_SRC_PATH.COMMANDS, (module) => {
            const command = module as BotCommand;
            const commandName = command.data.name;
            if (commandsMap[commandName]) {
                throw new Error(`the command: ${commandName} is already added`);
            }
            commandsMap[commandName] = command;
            logger.info(`Loaded command: ${commandName}`);
        });
    } catch (e) {
        logger.error(
            `Something wrong when load file commands, the error is: ${(e as Error).message}`,
        );
        return {};
    }

    return commandsMap;
};
const commandsMap = await loadCommands();
const commands = Object.values(commandsMap);

export { commandsMap, commands };
