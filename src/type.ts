import type {
    CacheType,
    ChatInputCommandInteraction,
    Client,
    Events,
    Interaction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export type BotCommand = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (chatInteraction: ChatInputCommandInteraction) => Promise<Interaction<CacheType>>;
};

type ClientAction = Extract<keyof Client, 'on' | 'once'>;

export type BotEvent<T> = {
    name: Events.ClientReady | Events.InteractionCreate;
    action: ClientAction;
    execute: (args: T) => void | Promise<void>;
};
