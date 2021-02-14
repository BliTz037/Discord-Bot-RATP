/* eslint-disable indent */
const Discord = require('discord.js');
const Api = require('../api');
const Url = require('../url.json');

module.exports = {
    name: 'horaire',
    description: 'Obtenir les horaires des différentes station',
    aliases: ['horaires', 'heure'],
    guildOnly: false,

    execute(msg, args) {
        let type = null
        let line = null;
        let station = null;
        let title = '';
        let embed = new Discord.MessageEmbed()
        .setColor('#00aa91')
        .setURL('https://www.ratp.fr/')
        .setAuthor('RATP Bot', Url.picto.picto_ratp, 'https://www.ratp.fr/')

        if (args.length < 3) {
            return msg.reply('Erreur: Il manque des arguments');
        }
        type = Api.checkType(args[0]);
        if (type == null) {
            return msg.reply('Correct usage: !horaire <metro|rer|bus|tramways> <station>');
        }
        if (type === 'rers') {
            line = args[1].toUpperCase();
        }
        else {
            line = args[1].toLowerCase();
        }
        args.shift();
        args.shift();
        station = args.join(' ');
        Api.get(`schedules/${type}/${line}/${station}/A%2BR`).then((resolve) => {
            embed.setTitle(`Horaire : ${station} - ${type} ${line}`);
            embed.setThumbnail(Url.picto[`picto_${type}`]);
            resolve.result.schedules.forEach(element => {
                title = element.destination;
                if (element.code)
                    title += ` ${element.code}`;
                embed.addFields({name: title, value:element.message});
            });
            return msg.channel.send(embed);
        }).catch((err) => {
            console.log(err);
            return msg.reply(`Erreur ${err.result.code}: La ligne de ${type} renseignée n'existe pas !`);
        });
    }
}