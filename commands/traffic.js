/* eslint-disable indent */
const Discord = require('discord.js');
const Api = require('../api');

function checkStatusTrafic(type, name) {
    const len = type.length;
    let normal = 0;
    let travaux = 0;
    let critical = 0;

    for (const m of type) {
        if (m.slug === 'normal') {
            normal++;
        }
        if (m.slug === 'normal_trav') {
            travaux++;
        }
        if (m.slug === 'critical') {
            critical++;
        }
    }
    return { name: `${len} ${name} :`, value: `:white_check_mark: OK : ${normal}\n:construction_worker: Travaux : ${travaux}\n:exclamation: Incidents : ${critical}` };
}

function checkStatusTraficOnlyType(type, name) {
    const len = type.length;
    const normal = [];
    const travaux = [];
    const critical = [];

    for (const m of type) {
        if (m.slug === 'normal') {
            normal.push(m.line);
        }
        if (m.slug === 'normal_trav') {
            travaux.push(m.line);
        }
        if (m.slug === 'critical') {
            critical.push(m.line);
        }
    }
    return { name: `${len} ${name} :`, value: `:white_check_mark: OK : ${normal.toString()}\n:construction_worker: Travaux : ${travaux.toString()}\n:exclamation: Incidents : ${critical.toString()}` };
}

module.exports = {
    name:'traffic',
    description: 'Affichage du trafic en temps réel sur les différentes lignes RATP',
    aliases: ['info', 'info-trafic', 'trafic-info', 'trafic'],
    guildOnly: false,
    async execute(msg, args) {
        const embed = new Discord.MessageEmbed()
        .setColor('#00aa91')
        .setTitle('TRAFIC RATP')
        .setURL('https://www.ratp.fr/infos-trafic')
        .setAuthor('RATP Bot', 'https://zupimages.net/up/21/05/84vw.png', 'https://www.ratp.fr/')
        .setThumbnail('https://www.pngfactory.net/_png/_thumb/quille-travaux_cameleonhelp_divers.png');
        if (args.length === 0) {
            Api.get('traffic').then((resp) => {
                embed.addFields(checkStatusTrafic(resp.result.metros, 'Metros :metro:'));
                embed.addFields(checkStatusTrafic(resp.result.rers, 'RERS :train2:'));
                embed.addFields(checkStatusTrafic(resp.result.tramways, 'Tramways :tram:'));
                msg.channel.send(embed);
            }).catch((reject) => {
                console.log('FAIL');
                console.log(reject);
            });
        }
        else if (args.length === 1) {
            if (['metros', 'rers', 'tramways'].includes(args[0])) {
                Api.get(`traffic/${args[0]}`).then((resp) => {
                    embed.addFields(checkStatusTraficOnlyType(resp.result[args[0]], args[0].charAt(0).toUpperCase() + args[0].slice(1)));
                    msg.channel.send(embed);
                }).catch((reject) => {
                    console.log('FAIL');
                    console.log(reject);
                });
            }
        }
    },
};