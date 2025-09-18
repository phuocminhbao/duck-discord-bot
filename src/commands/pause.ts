import type { GuildMember } from 'discord.js';
import { AudioManagerRegistry } from '../infrastructure/audio/audioManagerRegistry.js';
import { DuckSlashCommandBuilder } from '../infrastructure/extension/builders/DuckSlashCommandBuilder.js';
import { logger } from '../infrastructure/logger/logger.js';
import type { BotCommand } from '../types/botCommand.js';
import { PauseAudio } from '../application/useCases/audio/pauseAudio.js';

export const pause: BotCommand = {
    data: new DuckSlashCommandBuilder().setName('pause').setDescription('pause current audio'),
    execute: async (chatInteraction) => {
        const { interaction } = await chatInteraction.reply('pausing...');
        logger.info({ user: chatInteraction.user.tag }, `pausing current audio`);
        const member = chatInteraction.member as GuildMember;
        if (!member.voice.channel) {
            await chatInteraction.followUp('❌ Can not pause while you not in a room');
            return interaction;
        }
        const audioManager = AudioManagerRegistry.INSTANCE.getAudioManager(member.guild.id);

        try {
            const pauseAudio = new PauseAudio(audioManager);
            pauseAudio.execute();
            return interaction;
        } catch (error) {
            logger.error(
                { error, user: member.displayName, guildId: member.guild.id },
                'Failed to pause',
            );
            return interaction;
        }
    },
};
