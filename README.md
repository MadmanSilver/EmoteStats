# EmoteStats

EmoteStats is a simple bot that will allow you to get some basic metrics on the usage of emotes in your discord server. This bot was created due to the lack of analytics information for emotes provided by Discord.

## Installation

Should you wish to run your own instance of this bot, you can install it according to the instructions below:

1. Clone this repository to your local machine/server.
2. Install node.js if you don't already have it.
3. In your terminal, navigate to your local copy of this repo.
4. Run `npm install`
5. Create a new application at https://discord.com/developers/applications.
6. In the "Bot" tab of your new application, click "Reset Token" and copy the token.
7. Create a .env file in your copy of the repo.
8. In the .env file, type `DISCORD_TOKEN = ` and then paste your token. Save the file.
9. In your terminal, run `node src/index.js`.