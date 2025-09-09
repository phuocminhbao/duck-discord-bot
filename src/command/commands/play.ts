import type { VoiceConnection } from '@discordjs/voice';
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    StreamType,
    entersState,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import type { GuildMember } from 'discord.js';
import { DuckSlashCommandBuilder } from '../duckSlashBuilder/DuckSlashCommandBuilder.js';
import type { BotCommand } from '../../type.js';
import { logger } from '../../logger/logger.js';
import path from 'node:path';

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
        const filename = 'khobau';
        const member = chatInteraction.member as GuildMember;
        const memberVoiceChannel = member.voice.channel;

        if (!memberVoiceChannel) {
            const { interaction } = await chatInteraction.reply(
                '❌ You must be in a voice channel to use this command.',
            );
            return interaction;
        }

        const { interaction } = await chatInteraction.reply(
            `🎵 Playing local file: ${filename}.mp3`,
        );
        const connection = joinVoiceChannel({
            channelId: memberVoiceChannel.id,
            guildId: memberVoiceChannel.guild.id,
            adapterCreator: memberVoiceChannel.guild.voiceAdapterCreator,
        });

        try {
            // 1. Resolve absolute path to file
            const filePath = path.resolve('./resources', `${filename}.mp3`);
            console.log({ filePath });
            // 2. Create audio resource
            const resource = createAudioResource(filePath);

            const player = createAudioPlayer();
            player.play(resource);

            // 3. Connect to voice channel
            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Playing, () => {
                logger.info(`▶️ Now playing: ${filePath}`);
            });

            player.on(AudioPlayerStatus.Idle, () => {
                logger.info('⏹️ Playback finished');
            });

            player.on('error', (error) => {
                logger.error(error, 'Audio player error');
            });
        } catch (error) {
            logger.error(error, 'Failed to play local file');
            await chatInteraction.followUp('❌ Failed to play local file.');
            connection.destroy();
        } finally {
            // eslint-disable-next-line no-unsafe-finally
            return interaction;
        }
    },
};
