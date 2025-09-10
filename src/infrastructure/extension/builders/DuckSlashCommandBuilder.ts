import { SlashCommandBuilder } from 'discord.js';

class DuckSlashCommandBuilder extends SlashCommandBuilder {
    override setName(name: string): this {
        super.setName(`duck-${name}`);
        return this;
    }
}

export { DuckSlashCommandBuilder };
