import { DuckSlashCommandBuilder } from '../infrastructure/extension/builders/DuckSlashCommandBuilder.js';
import type { BotCommand } from '../types/botCommand.js';
import { PlayAudio } from '../application/useCases/audio/playAudio.js';
import { AudioManager } from '../infrastructure/audio/audioManager.js';
import type { GuildMember } from 'discord.js';
import { logger } from '../infrastructure/logger/logger.js';
import { AudioManagerRegistry } from '../infrastructure/audio/audioManagerRegistry.js';
import { guildId } from '../utils/env.js';
import { LocalAudioResourceResolver } from '../infrastructure/audio/audioResourceResolver/localAudioResourceResolver.js';
import { AudioResourceResolverFactory } from '../infrastructure/audio/audioResourceResolver/audioResourceResolverFactory.js';

enum OPTION {
    QUERY = 'query',
}

export const play: BotCommand = {
    data: new DuckSlashCommandBuilder()
        .setName('play')
        .setDescription('Play a local audio file')
        .addStringOption((option) =>
            option
                .setName(OPTION.QUERY)
                .setDescription('Audio file name (without extension)')
                .setRequired(true),
        ),

    async execute(chatInteraction) {
        const { interaction } = await chatInteraction.reply(
            `Proccessing ${chatInteraction.commandName}`,
        );
        const member = chatInteraction.member as GuildMember;
        const memberVoiceChannel = member.voice.channel;
        const query = chatInteraction.options.get(OPTION.QUERY)?.value as string;

        if (!memberVoiceChannel) {
            await chatInteraction.followUp(
                '❌ You must be in a voice channel to use this command.',
            );
            return interaction;
        }
        try {
            const audioManager = AudioManagerRegistry.INSTANCE.getOrRegisterAudioManager(
                guildId,
                () => new AudioManager(memberVoiceChannel.guild),
            );
            audioManager.setResourceResolver(AudioResourceResolverFactory.getResolver(query));
            const playUseCase = new PlayAudio(audioManager);
            await playUseCase.executeInChannel(memberVoiceChannel.id);
            return interaction;
        } catch (error) {
            logger.error(error, 'Failed to play local file');
            await chatInteraction.followUp(`❌ Failed to play the audio: ${query}`);
            return interaction;
        }
    },
};
