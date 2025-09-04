import type {
    ChatInputCommandInteraction,
    InteractionCallback,
    SlashCommandBuilder,
} from 'discord.js';

export type BotCommand = {
    data: SlashCommandBuilder;
    execute: (chatInteraction: ChatInputCommandInteraction) => Promise<InteractionCallback>;
};

export type BotEvent = {
    name: string;
    once?: boolean;
    execute: (...args: unknown[]) => void | Promise<void>;
};
