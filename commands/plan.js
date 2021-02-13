/*
Bus plan : https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/busratp/plan-de-ligne_busratp_ligne-125.1498809415.png
RER Plan : https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/rer/plan-de-ligne_rer_ligne-d.1587487193.png
Metro Plan : https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/metro/plan-de-ligne_metro_ligne-7.1504859450.png
Tramway plan : https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/tram/plan-de-ligne_tram_ligne-t3a.1547821950.png
*/
/* eslint-disable indent */
const Discord = require('discord.js');
const Api = require('../api');
const Url = require('../url.json');

module.exports = {
    name:'plan',
    description: 'Affichage d\'un plan du réseau',
    aliases: ['map', 'plan', 'plan-ratp'],
    guildOnly: false,
    async execute(msg, args) {
        const embed = new Discord.MessageEmbed()
        .setColor('#00aa91')
        .setTitle('PLAN RATP')
        .setURL('https://www.ratp.fr/plans-lignes')
        .setAuthor('RATP Bot', Url.picto.picto_ratp, 'https://www.ratp.fr/')
        .setThumbnail(Url.picto.picto_map);

        if (args.length === 0) {
            embed.setImage(Url.plan.default_plan);
            return msg.channel.send(embed);
        }

        /* !plan <bus|metro|tramways|noctilien|rer> */
        else if (args.length === 1) {
            let type = null;

            if (['aeroport', 'aéroport', 'roissy', 'cdg', 'orly'].includes(args[0])) {
                type = 'aeroport';
            }
            else {
                type = Api.checkType(args[0]);
            }
            if (type == null) {
                embed.setImage(Url.plan.default_plan);
                return msg.channel.send(embed);
            }
            embed.setThumbnail(Url.picto[`picto_${type}`]);
            embed.setImage(Url.plan[`${type}_plan`]);
            return msg.channel.send(embed);
        }
        /* !plan <bus|metro|tramways|noctilien|rer> <id> */
        else if (args.length === 2) {
            const type = Api.checkType(args[0]);
            const typeUrl = Api.checkTypeweb(type);
            let line = null;

            if (type == null) {
                return msg.reply('Correct usage:');
            }
            if (type === 'rers') {
                line = args[1].toUpperCase();
            }
            else {
                line = args[1].toLowerCase();
            }
            Api.get(`lines/${type}/${line}`).then((resolve) => {
                embed.setTitle(`PLAN ${resolve.result.name}`);
                embed.setThumbnail(Url.picto[`picto_${type}`]);
                embed.setImage(`${typeUrl}${line.toLowerCase()}.1498809415.png`);
                return msg.channel.send(embed);
            }).catch((err) => {
                console.log(err);
                return msg.reply(`Erreur ${err.result.code}: La ligne de ${type} renseignée n'existe pas !`);
            });
        }
    },
};