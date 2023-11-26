require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const publicCommands = [];
const privateCommands = [];

// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
            if (command.public)
			    publicCommands.push(command.data.toJSON());
            else
                privateCommands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${publicCommands.length} public and ${privateCommands.length} private application (/) commands.`);

		if (publicCommands.length > 0) {
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENTID),
                { body: publicCommands },
            );

            console.log(`Successfully reloaded ${data.length} public application (/) commands.`);
        }

        if (privateCommands.length > 0) {
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
                { body: privateCommands },
            );

            console.log(`Successfully reloaded ${data.length} private application (/) commands.`);
        }
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();