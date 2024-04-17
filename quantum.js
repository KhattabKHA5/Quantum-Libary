const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, clientId, prefix } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

// Setup commands folder
function setupCommandsFolder() {
    try {
        fs.mkdirSync('./commands');
        console.log('Commands folder created successfully.');
    } catch (err) {
        if (err.code === 'EEXIST') {
            console.log('Commands folder already exists.');
        } else {
            console.error('Error creating commands folder:', err);
        }
    }
}

// Register command handler
function registerCommand(commandName, handler) {
    client.commands.set(commandName, handler);
}

// Enable slash commands
function enableSlashCommands() {
    client.on('ready', () => {
        console.log('Quantum is ready!');
        client.application?.commands.set(Array.from(client.commands.values()));
    });
}

// Enable prefix commands
function enablePrefixCommands() {
    client.on('messageCreate', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        const handler = client.commands.get(command);
        if (!handler) return;

        try {
            handler.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while executing this command.');
        }
    });
}

module.exports = {
    setupCommandsFolder,
    registerCommand,
    enableSlashCommands,
    enablePrefixCommands,
    client
};

// Login the client
client.login(token);
