require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);
});

client.on('messageCreate', (msg) => {
    console.log(`(${msg.guild.name}/${msg.channel.name}) ${msg.author.username}: ${msg.content}`);
});

client.login(process.env.TOKEN);