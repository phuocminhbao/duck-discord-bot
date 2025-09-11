import { Client, GatewayIntentBits } from 'discord.js';

export class BotClient {
    private static INSTANCE: Client;

    private constructor() {}

    static getInstance() {
        if (!BotClient.INSTANCE) {
            const client = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.GuildVoiceStates,
                ],
            });
            BotClient.setInstance(client);
        }
        return BotClient.INSTANCE;
    }

    private static setInstance(instance: Client) {
        BotClient.INSTANCE = instance;
    }
}
