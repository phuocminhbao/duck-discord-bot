import { Client, GatewayIntentBits } from 'discord.js';

export class Bot {
    private static INSTANCE: Client;

    private constructor() {}

    static getInstance() {
        if (!Bot.INSTANCE) {
            const client = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.GuildVoiceStates,
                ],
            });
            Bot.setInstance(client);
        }
        return Bot.INSTANCE;
    }

    private static setInstance(instance: Client) {
        Bot.INSTANCE = instance;
    }
}
