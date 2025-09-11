import { discordToken } from './utils/env.js';
import { loadEvents } from './loaders/eventsLoader.js';
import { BotClient } from './infrastructure/botClient/botClient.js';

const botClient = BotClient.getInstance();

await loadEvents();

botClient.login(discordToken);
