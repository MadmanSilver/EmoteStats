const { SlashCommandBuilder, Collection, ChannelType } = require('discord.js');

module.exports = {
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('count')
        .setDescription('Counts the number of times each emote is used.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to count emotes in.'))
        .addBooleanOption(option => 
            option.setName('include-external')
                .setDescription('Should external emotes be included in the count?'))
        .addBooleanOption(option => 
            option.setName('include-reacts')
                .setDescription('Should reactions be included in the count?')),
    async execute(interaction) {
        // Let the user know that the command is processing.
        await interaction.deferReply();
        
        const counts = new Collection();
        const channels = [];
        const includeExternal = interaction.options.getBoolean('include-external') ?? false;
        const includeReacts = interaction.options.getBoolean('include-reacts') ?? true;
        const guildEmoji = [];

        if (chan = interaction.options.getChannel('channel')) {
            channels.push(chan);
        } else {
            (await interaction.guild.channels.fetch()).forEach(channel => {
                if (channel.isTextBased && channel.type != 4) {
                    channels.push(channel);
                }
            });
        }

        if (!includeExternal) {
            (await interaction.guild.emojis.fetch()).forEach(emoji => guildEmoji.push(`<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`));
        }

        const emojiRegex = /((?<!\\)<:[^:]+:(\d+)>)|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
      
        for (const channel of channels) {
            // Create message pointer.
            let message = await channel.messages
                .fetch({ limit: 1 })
                .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

            // Parse first message.
            if (message && !message.author.bot) {
                // Look for emotes based on emoteRegex and increase its count when found.
                message.content.match(emojiRegex)?.forEach(emoji => {
                    if (includeExternal || guildEmoji.includes(emoji)) {
                        if (counts.has(emoji)) {
                            counts.set(emoji, counts.get(emoji) + 1);
                        } else {
                            counts.set(emoji, 1);
                        }
                    }
                });

                // If including reacts, check reacts.
                if (includeReacts) {
                    message.reactions.cache.forEach(react => {
                        const emoji = `<${react.emoji.animated ? 'a' : ''}:${react.emoji.name}:${react.emoji.id}>`;
                
                        if (includeExternal || guildEmoji.includes(emoji)) {
                            if (counts.has(emoji)) {
                                counts.set(emoji, counts.get(emoji) + react.count);
                            } else {
                                counts.set(emoji, react.count);
                            }
                        }
                    });
                }
            }
    
            // Loop through paginated message history.
            while (message) {
                await channel.messages
                    .fetch({ limit: 100, before: message.id })
                    .then(messagePage => {
                        messagePage.forEach(msg => {
                            if (!msg.author.bot) {
                                // Look for emotes based on emoteRegex and increase its count when found.
                                msg.content.match(emojiRegex)?.forEach(emoji => {
                                    if (includeExternal || guildEmoji.includes(emoji)) {
                                        if (counts.has(emoji)) {
                                            counts.set(emoji, counts.get(emoji) + 1);
                                        } else {
                                            counts.set(emoji, 1);
                                        }
                                    }
                                });

                                // If including reacts, check reacts.
                                if (includeReacts) {
                                    msg.reactions.cache.forEach(react => {
                                        const emoji = `<${react.emoji.animated ? 'a' : ''}:${react.emoji.name}:${react.emoji.id}>`;
                
                                        if (includeExternal || guildEmoji.includes(emoji)) {
                                            if (counts.has(emoji)) {
                                                counts.set(emoji, counts.get(emoji) + react.count);
                                            } else {
                                                counts.set(emoji, react.count);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    
                        // Update our message pointer to be the last message on the page of messages.
                        message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                    });
            }
        }

        // Construct response.
        let response = 'Results:';

        counts.forEach((value, key) => {
            let nextLine = `\n${key} - ${value}`;

            if (response.length + nextLine.length <= 2000) {
                response += nextLine;
            } else {
                interaction.followUp(response);
                response = nextLine;
            }
        });
      
        interaction.followUp(response);
    },
    public: true,
};