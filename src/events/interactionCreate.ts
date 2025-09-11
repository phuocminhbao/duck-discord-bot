import { Events } from 'discord.js';
import { commandsMap } from '../loaders/commandsLoader.js';
import { logger } from '../infrastructure/logger/logger.js';
import { isDev } from '../utils/env.js';
import { Bot } from '../infrastructure/bot/botAdapter.js';

const loadInteractionCreateEvent = () => {
    const bot = Bot.getInstance();
    bot.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) {
            logger.error('This type of command is not supported');
            return;
        }
        const command = commandsMap[interaction.commandName];
        if (!command) {
            logger.error(`Unknown command: ${interaction.commandName}`);
            await interaction.reply({
                content: 'Quack quack, unknown command, Quack quack',
                withResponse: true,
            });
            return;
        }
        try {
            const sentInteraction = await command.execute(interaction);
            logger.info(
                { command: interaction.commandName, user: interaction.user.tag },
                'Command executed',
            );
            if (isDev) {
                await interaction.followUp(
                    `Latency: ${sentInteraction.createdTimestamp - sentInteraction.createdTimestamp}ms`,
                );
            }
        } catch (err) {
            logger.error({ command: interaction.commandName, err }, 'Command failed');
            if (interaction.isRepliable() && !interaction.replied) {
                await interaction
                    .reply({ content: '❌ Something went wrong.', ephemeral: true })
                    .catch(() => {});
            }
        }
    });
};

export default loadInteractionCreateEvent;
