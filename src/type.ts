import type {
    CacheType,
    ChatInputCommandInteraction,
    Interaction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export type BotCommand = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (chatInteraction: ChatInputCommandInteraction) => Promise<Interaction<CacheType>>;
};

export type BotEvent = {
    name: string;
    once?: boolean;
    execute: (...args: unknown[]) => void | Promise<void>;
};
