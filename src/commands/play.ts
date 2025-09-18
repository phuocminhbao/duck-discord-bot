import { DuckSlashCommandBuilder } from '../infrastructure/extension/builders/DuckSlashCommandBuilder.js';
import { OPTION, type BotCommand } from '../types/botCommand.js';
import { PlayAudio } from '../application/useCases/audio/playAudio.js';
import { AudioManager } from '../infrastructure/audio/audioManager.js';
import type { GuildMember } from 'discord.js';
import { logger } from '../infrastructure/logger/logger.js';
import { AudioManagerRegistry } from '../infrastructure/audio/audioManagerRegistry.js';
import { AudioResourceResolverFactory } from '../infrastructure/audio/audioResourceResolver/audioResourceResolverFactory.js';

export const play: BotCommand = {
    data: new DuckSlashCommandBuilder()
        .setName('play')
        .setDescription('Play audio from youtube or local')
        .addStringOption((option) =>
            option
                .setName(OPTION.QUERY)
                .setDescription('Youtube link or local audio file name')
                .setRequired(true),
        ),

    async execute(chatInteraction) {
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
        try {
            const audioManager = AudioManagerRegistry.INSTANCE.getOrRegisterAudioManager(
                member.guild.id,
                () => new AudioManager(member.guild),
            );
            audioManager.setResourceResolver(AudioResourceResolverFactory.getResolver(query));
            const playAudio = new PlayAudio(audioManager);
            await playAudio.executeInChannel(memberVoiceChannel.id);
            return interaction;
        } catch (error) {
            logger.error(
                { error, user: member.displayName, guildId: member.guild.id },
                'Failed to play',
            );
            await chatInteraction.followUp(`❌ Oh no, failed to play: ${query}`);
            return interaction;
        }
    },
};
