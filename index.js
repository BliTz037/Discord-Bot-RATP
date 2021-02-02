/* eslint-disable indent */
const fs = require('fs');
const Discord = require('discord.js');
const dotenv = require('dotenv');
const config = require('./config.json');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const client = new Discord.Client();

dotenv.config();
client.commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('RATP BOT : En voiture tout le monde !');
});

client.on('message', message => {
    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const cmdName = args.shift().toLocaleLowerCase();
    const command = client.commands.get(cmdName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if (!command) return;
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }
    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(config.token);