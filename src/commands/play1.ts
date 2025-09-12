import { DuckSlashCommandBuilder } from '../infrastructure/extension/builders/DuckSlashCommandBuilder.js';
import type { BotCommand } from '../types/botCommand.js';
import { PlayUseCase } from '../application/audio/playUseCase.js';
import { AudioManager } from '../infrastructure/audio/audioManager.js';
import { LocalBot } from '../infrastructure/bot/LocalBot.js';

enum OPTION {
    QUERY = 'query',
}

export const play: BotCommand = {
    data: new DuckSlashCommandBuilder()
        .setName('play1')
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
        const audioManager = new AudioManager(new LocalBot(''));
        const playUseCase = new PlayUseCase(audioManager);
        playUseCase.execute('');
        return interaction;
    },
};
