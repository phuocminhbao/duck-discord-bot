import type { Client, ClientEvents, Events, Interaction } from 'discord.js';

export type ClientAction = keyof Client;

export type BotEvent =
    | {
          name: Events.ClientReady;
          action: 'once';
          execute: (client: Client) => void;
      }
    | {
          name: Events.InteractionCreate;
          action: 'on';
          execute: (Interaction: ClientEvents[Events.InteractionCreate]) => Promise<void>;
      };
