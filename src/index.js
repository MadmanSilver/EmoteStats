require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

// Create the client instance.
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

// Log when the bot successfully connects.
client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);
});

// Log each message (for testing purposed only)
client.on('messageCreate', (msg) => {
    console.log(`(${msg.guild.name}/${msg.channel.name}) ${msg.author.username}: ${msg.content}`);
});

// Go online
client.login(process.env.TOKEN);