/* eslint-disable indent */
const Discord = require('discord.js');
const Api = require('../api');
const Url = require('../url.json');

module.exports = {
    name: 'station',
    description: 'Obtenir la liste de toute les stations d\'une ligne',
    aliases: ['station', 'stations', 'ligne'],
    guildOnly: false,

    execute(msg, args) {
        let type = null
        let line = null;
        let str = '```\n';
        let embed = new Discord.MessageEmbed()
        .setColor('#00aa91')
        .setURL('https://www.ratp.fr/')
        .setAuthor('RATP Bot', Url.picto.picto_ratp, 'https://www.ratp.fr/')

        if (args.length < 2) {
            return msg.reply('Erreur: Il manque des arguments');
        }
        type = Api.checkType(args[0]);
        if (type == null) {
            return msg.reply('Correct usage: !station <bus|metro|tramways|noctilien|rer> <ligne>');
        }
        if (type === 'rers') {
            line = args[1].toUpperCase();
        }
        else {
            line = args[1].toLowerCase();
        }
        Api.get(`stations/${type}/${line}`).then((resolve) => {
            embed.setTitle(`Liste des stations du ${type} ${line}`);
            embed.setThumbnail(Url.picto[`picto_${type}`]);
            resolve.result.stations.forEach(element => {
                str += `- ${element.name}\n`;
            });
            str += '```'
            embed.addFields({name: `${resolve.result.stations.length} stations`, value: str});
            return msg.channel.send(embed);
        }).catch((err) => {
            console.log(err);
            return msg.reply(`Erreur ${err.result.code}: La ligne de ${type} renseignée n'existe pas !`);
        });
    }
}