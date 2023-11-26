const { Events } = require('discord.js');

// Log each message (for testing purposed only).
module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(msg) {
        console.log(`(${msg.guild.name}/${msg.channel.name}) ${msg.author.username}: ${msg.content}`);
    },
};