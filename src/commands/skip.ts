import type { GuildMember } from 'discord.js';
import { AudioManagerRegistry } from '../infrastructure/audio/audioManagerRegistry.js';
import { DuckSlashCommandBuilder } from '../infrastructure/extension/builders/DuckSlashCommandBuilder.js';
import { logger } from '../infrastructure/logger/logger.js';
import type { BotCommand } from '../types/botCommand.js';
import { SkipAudioNow } from '../application/useCases/audio/skipAudio.js';

export const skip: BotCommand = {
    data: new DuckSlashCommandBuilder().setName('skip').setDescription('skip current audio'),
    execute: async (chatInteraction) => {
        const { interaction } = await chatInteraction.reply('Skipping...');
        logger.info({ user: chatInteraction.user.tag }, `Skipping current audio`);
        const member = chatInteraction.member as GuildMember;
        if (!member.voice.channel) {
            await chatInteraction.followUp('❌ Can not skip while you not in a room');
            return interaction;
        }
        const audioManager = AudioManagerRegistry.INSTANCE.getAudioManager(member.guild.id);

        try {
            const skipAudio = new SkipAudioNow(audioManager);
            skipAudio.execute();
            return interaction;
        } catch (error) {
            logger.error(
                { error, user: member.nickname, guildId: member.guild.id },
                'Failed to skip',
            );
            return interaction;
        }
    },
};
