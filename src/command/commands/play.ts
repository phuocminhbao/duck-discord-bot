import type { GuildMember } from 'discord.js';
import type { BotCommand } from '../../type.js';
import { DuckSlashCommandBuilder } from '../duckSlashBuilder/DuckSlashCommandBuilder.js';
import {
    joinVoiceChannel,
    createAudioResource,
    createAudioPlayer,
    AudioPlayerStatus,
    StreamType,
} from '@discordjs/voice';
import { logger } from '../../logger/logger.js';
import type { Payload } from 'youtube-dl-exec';

const youtubeDl = import('youtube-dl-exec');
enum OPTION {
    QUERY = 'query',
}

const RICK_ROLL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1';

export const play: BotCommand = {
    data: new DuckSlashCommandBuilder()
        .setName('play')
        .setDescription('Play music from YouTube')
        .addStringOption((option) =>
            option
                .setName(OPTION.QUERY)
                .setDescription('YouTube URL or search term')
                .setRequired(true),
        ),
    async execute(chatInteraction) {
        const query = chatInteraction.options.getString(OPTION.QUERY) ?? RICK_ROLL;

        // Check if user is in a voice channel
        const member = chatInteraction.member as GuildMember;
        const memberVoiceChannel = member.voice.channel;
        if (!memberVoiceChannel) {
            const { interaction } = await chatInteraction.reply(
                '❌ You must be in a voice channel to use this command.',
            );
            return interaction;
        }

        const { interaction } = await chatInteraction.reply(`🔎 Searching for: ${query}`);
        try {
            // 1. Fetch metadata
            const info = (await (
                await youtubeDl
            ).youtubeDl(query, {
                dumpSingleJson: true,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
            })) as Payload;

            // 2. Pick the best audio-only format (Opus/WebM usually best)
            const format = info.formats.find(
                (f: any) => f.acodec !== 'none' && f.vcodec === 'none',
            );
            if (!format?.url) {
                await chatInteraction.followUp('❌ Could not extract audio stream.');
                return interaction;
            }
            const audioUrl = format.url;
            logger.info(`🎵 Using direct Opus stream: ${audioUrl}`);

            // 3. Connect to voice channel
            const connection = joinVoiceChannel({
                channelId: memberVoiceChannel.id,
                guildId: memberVoiceChannel.guild.id,
                adapterCreator: memberVoiceChannel.guild.voiceAdapterCreator,
            });

            // 4. Create resource directly from URL
            const resource = createAudioResource(info.stea, {
                inputType: StreamType.Opus, // let Discord.js figure it out
            });
            const player = createAudioPlayer();

            connection.subscribe(player);
            player.play(resource);

            // 5. Player state listeners
            player.on(AudioPlayerStatus.Playing, () => {
                logger.info(`▶️ Now playing: ${info.title}`);
            });
            player.on(AudioPlayerStatus.Idle, () => {
                logger.info('⏹️ Playback finished');
            });
            player.on('error', (error) => {
                logger.error(error, 'Audio player error');
            });

            await chatInteraction.followUp(`▶️ Now playing: **${info.title}**`);
        } catch (error) {
            logger.error({ error }, 'Error in /play command');
            await chatInteraction.followUp('❌ Failed to play track.');
        }

        return interaction;
    },
};
