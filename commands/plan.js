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
                embed.setImage(`https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/busratp/plan-de-ligne_busratp_ligne-${line}.1498809415.png`);
                return msg.channel.send(embed);
            }).catch((err) => {
                return msg.reply(`Erreur ${err.result.code}: La ligne de ${type} renseignée n'existe pas !`);
            });
        }
/*
        else if (args.length === 2) {
            if (args[0] === 'bus') {
                Api.get(`lines/buses/${args[1]}`).then((resolve) => {
                    embed.setTitle(`PLAN ${resolve.result.name}`);
                    embed.setThumbnail(Url.picto.picto_bus);
                    embed.setImage(`https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/busratp/plan-de-ligne_busratp_ligne-${args[1]}.1498809415.png`);
                    return msg.channel.send(embed);
                }).catch((err) => {
                    return msg.reply(`Erreur ${err.result.code}: La ligne de bus ${args[1]} n'existe pas !`);
                });
            }
            else if (['N', 'n', 'noctilien', 'busn'].includes(args[0])) {
                Api.get(`lines/noctiliens/${args[1]}`).then((resolve) => {
                    embed.setTitle(`PLAN ${resolve.result.name}`);
                    embed.setThumbnail(Url.picto.picto_noctilien);
                    embed.setImage(`https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/noctilien/plan-de-ligne_noctilien_ligne-n${args[1]}.1601022672.png`);
                    return msg.channel.send(embed);
                }).catch((err) => {
                    return msg.reply(`Erreur ${err.result.code}: La ligne de bus noctiliens ${args[1]} n'existe pas !`);
                });
            }
            else if (['rer', 'rers'].includes(args[0])) {
                Api.get(`lines/rers/${args[1].toUpperCase()}`).then((resolve) => {
                    embed.setTitle(`PLAN ${resolve.result.name}`);
                    embed.setThumbnail(Url.picto.picto_rer);
                    embed.setImage(`https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/rer/plan-de-ligne_rer_ligne-${args[1].toLowerCase()}.1587487193.png`);
                    return msg.channel.send(embed);
                }).catch((err) => {
                    return msg.reply(`Erreur ${err.result.code}: La ligne RER ${args[1]} n'existe pas !`);
                });
            }
            else if (['metro', 'm', 'metros'].includes(args[0])) {
                Api.get(`lines/metros/${args[1].toLowerCase()}`).then((resolve) => {
                    embed.setTitle(`PLAN ${resolve.result.name}`);
                    embed.setThumbnail(Url.picto.picto_metro);
                    embed.setImage(`https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/metro/plan-de-ligne_metro_ligne-${args[1].toLowerCase()}.1504859450.png`);
                    return msg.channel.send(embed);
                }).catch((err) => {
                    return msg.reply(`Erreur ${err.result.code}: La ligne de métro ${args[1]} n'existe pas !`);
                });
            }
            else if (['T', 'tramway', 'tramways', 't'].includes(args[0])) {
                Api.get(`lines/tramways/${args[1].toLowerCase()}`).then((resolve) => {
                    embed.setTitle(`PLAN ${resolve.result.name}`);
                    embed.setThumbnail(Url.picto.picto_tramway);
                    embed.setImage(`https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/tram/plan-de-ligne_tram_ligne-t${args[1].toLowerCase()}.1547821950.png`);
                    return msg.channel.send(embed);
                }).catch((err) => {
                    return msg.reply(`Erreur ${err.result.code}: La ligne de métro ${args[1]} n'existe pas !`);
                });
            }
            else {
                return msg.reply('Correct usage:');
            }
        }*/
    },
};
/*
Bus plan : https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/busratp/plan-de-ligne_busratp_ligne-125.1498809415.png
RER Plan : https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/rer/plan-de-ligne_rer_ligne-d.1587487193.png
Metro Plan : https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/metro/plan-de-ligne_metro_ligne-7.1504859450.png
Tramway plan : https://www.ratp.fr/sites/default/files/lines-assets/plan-de-ligne/tram/plan-de-ligne_tram_ligne-t3a.1547821950.png
*/

        /* else if (args.length === 1) {
            if (args[0] === 'bus') {
                embed.setThumbnail(Url.picto.picto_bus);
                embed.setImage(Url.plan.bus_plan);
                return msg.channel.send(embed);
            }
            else if (['N', 'n', 'noctilien', 'busn'].includes(args[0])) {
                embed.setThumbnail(Url.picto.picto_noctilien);
                embed.setImage(Url.plan.noctiliens_plan);
                return msg.channel.send(embed);
            }
            else if (['rer', 'rers'].includes(args[0])) {
                embed.setThumbnail(Url.picto.picto_rers);
                embed.setImage(Url.plan.rers_plan);
                return msg.channel.send(embed);
            }
            else if (['metro', 'm', 'metros', 'T', 't', 'tramway'].includes(args[0])) {
                if (['T', 'tramway', 't'].includes(args[0])) {
                    embed.setThumbnail(Url.picto.picto_tramways);
                }
                else {
                    embed.setThumbnail(Url.picto.picto_metros);
                }
                embed.setImage(Url.plan.metros_plan);
                return msg.channel.send(embed);
            }
            else if (['aeroport', 'aéroport', 'roissy', 'cdg', 'orly'].includes(args[0])) {
                embed.setThumbnail(Url.picto.picto_aeroport);
                embed.setImage(Url.plan.aeroport_plan);
                return msg.channel.send(embed);
            }
            else {
                embed.setImage(Url.plan.default_plan);
                return msg.channel.send(embed);
            }
        }*/