import type { GuildMember } from 'discord.js';
import { DuckSlashCommandBuilder } from '../infrastructure/extension/builders/DuckSlashCommandBuilder.js';
import { logger } from '../infrastructure/logger/logger.js';
import { OPTION, type BotCommand } from '../types/botCommand.js';
import { AudioManager } from '../infrastructure/audio/audioManager.js';
import { AudioManagerRegistry } from '../infrastructure/audio/audioManagerRegistry.js';
import { AudioResourceResolverFactory } from '../infrastructure/audio/audioResourceResolver/audioResourceResolverFactory.js';
import { PlayAudioNow } from '../application/useCases/audio/playAudioNow.js';

export const playNow: BotCommand = {
    data: new DuckSlashCommandBuilder()
        .setName('play-now')
        .setDescription('play an audio immediately')
        .addStringOption((option) =>
            option
                .setName(OPTION.QUERY)
                .setDescription('Youtube link or local audio file name immediately')
                .setRequired(true),
        ),
    execute: async (chatInteraction) => {
        const query = chatInteraction.options.get(OPTION.QUERY)?.value as string;
        const { interaction } = await chatInteraction.reply(`Looking for ${query}`);
        const member = chatInteraction.member as GuildMember;
        const memberVoiceChannel = member.voice.channel;
        if (!memberVoiceChannel) {
            await chatInteraction.followUp(
                '❌ How the fuck am I supposed to know which room to join if your dumb ass is not even in one?',
            );
            return interaction;
        }
        const audioManager = AudioManagerRegistry.INSTANCE.getOrRegisterAudioManager(
            member.guild.id,
            () => new AudioManager(member.guild),
        );
        try {
            audioManager.setResourceResolver(AudioResourceResolverFactory.getResolver(query));
            const playAudioNow = new PlayAudioNow(audioManager);
            await playAudioNow.executeInChannel(memberVoiceChannel.id);
            return interaction;
        } catch (error) {
            logger.error(
                { error, user: member.nickname, guildId: member.guild.id },
                'Failed to play',
            );
            await chatInteraction.followUp(`❌ Oh no, failed to play: ${query}`);
            return interaction;
        }
    },
};
