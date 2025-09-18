import type { GuildMember } from 'discord.js';
import { AudioManagerRegistry } from '../infrastructure/audio/audioManagerRegistry.js';
import { DuckSlashCommandBuilder } from '../infrastructure/extension/builders/DuckSlashCommandBuilder.js';
import { logger } from '../infrastructure/logger/logger.js';
import type { BotCommand } from '../types/botCommand.js';
import { StopAudio } from '../application/useCases/audio/stopAudio.js';

export const stop: BotCommand = {
    data: new DuckSlashCommandBuilder().setName('stop').setDescription('stop current audio'),
    execute: async (chatInteraction) => {
        const { interaction } = await chatInteraction.reply('stopping...');
        logger.info({ user: chatInteraction.user.tag }, `stopping current audio`);
        const member = chatInteraction.member as GuildMember;
        if (!member.voice.channel) {
            await chatInteraction.followUp('❌ Can not stop while you not in a room');
            return interaction;
        }
        const audioManager = AudioManagerRegistry.INSTANCE.getAudioManager(member.guild.id);

        try {
            const stopAudio = new StopAudio(audioManager);
            stopAudio.execute();
            return interaction;
        } catch (error) {
            logger.error(
                { error, user: member.displayName, guildId: member.guild.id },
                'Failed to stop',
            );
            return interaction;
        }
    },
};
