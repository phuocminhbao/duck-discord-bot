import { readdirSync } from 'node:fs';
import path from 'node:path';
import type { BotCommand } from '../../type.js';
import { pathToFileURL } from 'node:url';
import { logger } from '../../logger/logger.js';

/**
 * Dynamically loads all command files in src/commands.
 */
export const loadCommands = async (): Promise<Record<string, BotCommand>> => {
    const commandsMap: Record<string, BotCommand> = {};
    try {
        const commandsPath = path.join(process.cwd(), 'src', 'command/commands');
        const files = readdirSync(commandsPath);

        for (const file of files) {
            if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;

            const filePath = path.join(commandsPath, file);
            const fileUrl = pathToFileURL(filePath).href; // ✅ convert to file://

            const commandModule = await import(fileUrl);
            const command: BotCommand = commandModule.default ?? Object.values(commandModule)[0];
            const commandName = command.data.name;
            if (commandsMap[commandName]) {
                throw new Error(`the command: ${commandName} is already added`);
            }
            if (command?.data && !!command?.execute) {
                commandsMap[commandName] = command;
                logger.info(`Loaded command: ${commandName}`);
            } else {
                logger.warn(`Invalid command skipped: ${file}`);
            }
        }
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
