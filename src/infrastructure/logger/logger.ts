import pino from 'pino';
import { isDev } from '../../utils/env.js';

function getCallerInfo() {
    const stack = new Error().stack?.split('\n');
    const callerLine = stack?.[3] || '';
    const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
    if (match) {
        const [, file, line] = match;
        return `${file.replace(process.cwd(), '')}:${line}`;
    }
    return 'unknown';
}

const baseLogger = pino(
    isDev
        ? {
              transport: {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                      translateTime: 'HH:MM:ss',
                      ignore: 'pid,hostname',
                  },
              },
          }
        : {},
);

function wrapWithCaller(fn: (obj: unknown, msg?: string, ...args: unknown[]) => void) {
    return (objOrMsg: unknown, msg?: string, ...args: unknown[]) => {
        if (isDev) {
            const caller = getCallerInfo();
            if (typeof objOrMsg === 'string') {
                return fn({}, `[${caller}] ${objOrMsg}`, ...args);
            }
            if (msg) {
                return fn(objOrMsg, `[${caller}] ${msg}`, ...args);
            }
            return fn(objOrMsg);
        }
        return fn(objOrMsg, msg, ...args);
    };
}

export const logger = {
    info: wrapWithCaller(baseLogger.info.bind(baseLogger)),
    warn: wrapWithCaller(baseLogger.warn.bind(baseLogger)),
    error: wrapWithCaller(baseLogger.error.bind(baseLogger)),
    debug: wrapWithCaller(baseLogger.debug.bind(baseLogger)),
};
