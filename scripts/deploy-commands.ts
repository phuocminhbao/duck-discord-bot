import { REST, Routes } from 'discord.js';
import { commands } from '../src/command/loader/loader.js';
import { logger } from '../src/logger/logger.js';
import { clientId, discordToken, guildId } from '../src/utils/env.js';

const deployCommands = Object.values(commands).map((command) => command.data.toJSON());

const rest = new REST({ version: '10' }).setToken(discordToken);

async function deploy() {
    try {
        logger.info('Refreshing guild (/) commands…');
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: deployCommands,
        });
        logger.info('Successfully reloaded guild (/) commands.');
    } catch (error) {
        logger.error({ error }, 'Failed to deploy commands:');
        process.exitCode = 1;
    }
}
deploy();
