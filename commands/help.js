/* eslint-disable indent */
const Discord = require('discord.js');
const Api = require('../api');
const Url = require('../url.json');

module.exports = {
    name: 'help',
    description: 'Help',
    aliases: ['help', 'helps'],
    guildOnly: false,

    execute(msg, args) {
        const embed = new Discord.MessageEmbed()
        .setColor('#00aa91')
        .setTitle('Help')
        .setURL('https://www.ratp.fr/')
        .setAuthor('RATP Bot', Url.picto.picto_ratp, 'https://www.ratp.fr/')
        .setThumbnail(Url.picto.picto_help);

        embed.addFields(
            {name: '`!ping`', value: 'Ping ! :ping_pong:'},
            {name: '`!lapin`', value: 'Voir le lapin du métro :rabbit::metro:'},
            {name: '`!traffic <type> <ligne>`', value: 'Afficher le trafic en temps réel :vertical_traffic_light:'},
            {name: '`!plan <type> <ligne>`', value: 'Obtenir un plan du réseau ou d\'une ligne :map:'},
            {name: '`!station <type> <ligne>`', value: 'Afficher la liste de toute les stations de la ligne :station:'},
            {name: '`!horaire <type> <ligne> <station>`', value: 'Afficher les horaire en temps réel d\'une station :clock10:'}
        );
        msg.channel.send(embed);
    }
}