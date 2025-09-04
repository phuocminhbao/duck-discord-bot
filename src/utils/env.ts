import zod from 'zod';

const zodEnv = zod.object({
    DISCORD_TOKEN: zod.string().min(1),
    NODE_ENV: zod.string().default('development'),
    CLIENT_ID: zod.string().min(1), // Application ID
    GUILD_ID: zod.string().min(1), // Your server ID
});
const env = zodEnv.parse(process.env);
const isDev = env.NODE_ENV !== 'production';
const discordToken = env.DISCORD_TOKEN;
const clientId = env.CLIENT_ID;
const guildId = env.GUILD_ID;

export { isDev, discordToken, clientId, guildId };
