import { Events } from 'discord.js';
import { logger } from '../infrastructure/logger/logger.js';
import { BotClient } from '../infrastructure/botClient/botClient.js';

const loadReadyEvent = () => {
    const botClient = BotClient.getInstance();
    botClient.once(Events.ClientReady, (client) => {
        logger.info(`Ready: ${client.user?.tag}`);
    });
};
export default loadReadyEvent;
