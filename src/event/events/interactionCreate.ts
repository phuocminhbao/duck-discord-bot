import type { Interaction } from 'discord.js';
import { Events } from 'discord.js';
import { commandsMap } from '../../command/loader/loader.js';
import { logger } from '../../logger/logger.js';
import { isDev } from '../../utils/env.js';
import type { BotEvent } from '../../type.js';

const interactionCreate: BotEvent<Interaction> = {
    name: Events.InteractionCreate,
    action: 'on',
    async execute(interaction) {
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
    },
};

export default interactionCreate;
