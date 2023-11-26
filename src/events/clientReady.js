const { Events } = require('discord.js');

// Log when the bot successfully connects.
module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`${client.user.tag} is online.`);
    },
};