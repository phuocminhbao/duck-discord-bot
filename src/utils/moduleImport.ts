import { readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { logger } from '../infrastructure/logger/logger.js';

export enum SUB_SRC_PATH {
    COMMANDS = 'commands',
    EVENTS = 'events',
}

const SRC_PATH = 'src';

export const forEachModule = async (
    subSrcPath: SUB_SRC_PATH,
    isDefaultOnly: boolean,
    callback: (module: unknown) => void,
) => {
    const subPath = path.join(process.cwd(), SRC_PATH, subSrcPath);
    const filePaths = readdirSync(subPath);
    for (const filePath of filePaths) {
        if (!filePath.endsWith('.ts') && !filePath.endsWith('.js')) continue;

        const fullFilePath = path.join(subPath, filePath);
        const fileUrl = pathToFileURL(fullFilePath).href;

        const module = await import(fileUrl);
        if (!isDefaultOnly) {
            callback(module.default ?? Object.values(module)[0]);
            continue;
        }
        if (!module.default) {
            logger.warn(`${fileUrl} doesn't have default export`);
            continue;
        }
        callback(module.default);
    }
};
