import { Client, Events, GatewayIntentBits } from 'discord.js';
import { discordToken } from './utils/env.js';
import { loadEvents } from './loaders/eventsLoader.js';
import { Bot } from './infrastructure/bot/botAdapter.js';

const bot = Bot.getInstance();

await loadEvents(bot);

bot.login(discordToken);
