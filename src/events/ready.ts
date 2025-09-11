import { Events } from 'discord.js';
import { logger } from '../infrastructure/logger/logger.js';
import { Bot } from '../infrastructure/bot/botAdapter.js';

const loadReadyEvent = () => {
    const bot = Bot.getInstance();
    bot.once(Events.ClientReady, (client) => {
        logger.info(`Ready: ${client.user?.tag}`);
    });
};
export default loadReadyEvent;
