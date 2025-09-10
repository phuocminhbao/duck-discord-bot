import { Client, GatewayIntentBits } from 'discord.js';
import { discordToken } from './utils/env.js';
import { loadEvents } from './bootstrap/eventsLoader.js';

// Minimal intents for slash command interactions
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

await loadEvents(client);

client.login(discordToken);
