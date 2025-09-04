import { Client, GatewayIntentBits } from 'discord.js';
import { loadEvents } from './event/loader/loader.js';
import { discordToken } from './utils/env.js';

// Minimal intents for slash command interactions
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

await loadEvents(client);

client.login(discordToken);
