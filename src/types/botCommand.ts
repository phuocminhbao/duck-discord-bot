import type {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    ChatInputCommandInteraction,
    Interaction,
    CacheType,
} from 'discord.js';

export type BotCommand = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (chatInteraction: ChatInputCommandInteraction) => Promise<Interaction<CacheType>>;
};

export enum OPTION {
    QUERY = 'query',
}
