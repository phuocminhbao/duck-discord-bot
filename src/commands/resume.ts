import type { GuildMember } from 'discord.js';
import { AudioManagerRegistry } from '../infrastructure/audio/audioManagerRegistry.js';
import { DuckSlashCommandBuilder } from '../infrastructure/extension/builders/DuckSlashCommandBuilder.js';
import { logger } from '../infrastructure/logger/logger.js';
import type { BotCommand } from '../types/botCommand.js';
import { ResumeAudio } from '../application/useCases/audio/resumeAudio.js';

export const resume: BotCommand = {
    data: new DuckSlashCommandBuilder().setName('resume').setDescription('resume current audio'),
    execute: async (chatInteraction) => {
        const { interaction } = await chatInteraction.reply('resuming...');
        logger.info({ user: chatInteraction.user.tag }, `resuming current audio`);
        const member = chatInteraction.member as GuildMember;
        if (!member.voice.channel) {
            await chatInteraction.followUp('❌ Can not resume while you not in a room');
            return interaction;
        }
        const audioManager = AudioManagerRegistry.INSTANCE.getAudioManager(member.guild.id);

        try {
            const resumeAudio = new ResumeAudio(audioManager);
            resumeAudio.execute();
            return interaction;
        } catch (error) {
            logger.error(
                { error, user: member.displayName, guildId: member.guild.id },
                'Failed to resume',
            );
            return interaction;
        }
    },
};
