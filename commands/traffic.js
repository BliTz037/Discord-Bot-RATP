/* eslint-disable indent */
const Discord = require('discord.js');
const Api = require('../api');

function checkStatusTrafic(type, name, DisplayLine) {
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
    if (!DisplayLine) {
        return { name: `${len} ${name} :`, value: `:white_check_mark: OK : ${normal.length}\n:construction_worker: Travaux : ${travaux.length}\n:exclamation: Incidents : ${critical.length}` };
    }
    return { name: `${len} ${name} :`, value: `:white_check_mark: OK : ${normal.length} (${normal.join(', ')})\n:construction_worker: Travaux : ${travaux.length} (${travaux.join(', ')})\n:exclamation: Incidents : ${critical.length} (${critical.join(', ')})` };
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
    return { name: `${len} ${name} :`, value: `:white_check_mark: OK : ${normal.join(', ')}\n:construction_worker: Travaux : ${travaux.join(', ')}\n:exclamation: Incidents : ${critical.join(', ')}` };
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
                embed.addFields(checkStatusTrafic(resp.result.metros, 'Metros :metro:', false));
                embed.addFields(checkStatusTrafic(resp.result.rers, 'RERS :train2:', true));
                embed.addFields(checkStatusTrafic(resp.result.tramways, 'Tramways :tram:', true));
                return msg.channel.send(embed);
            }).catch((reject) => {
                console.log('FAIL');
                console.log(reject);
                return;
            });
        }
        else if (args.length === 1) {
            if (['metros', 'rers', 'tramways'].includes(args[0])) {
                Api.get(`traffic/${args[0]}`).then((resp) => {
                    embed.addFields(checkStatusTraficOnlyType(resp.result[args[0]], args[0].charAt(0).toUpperCase() + args[0].slice(1)));
                    return msg.channel.send(embed);
                }).catch((reject) => {
                    console.log('FAIL');
                    console.log(reject);
                    return;
                });
            }
        }
        else if (args.length === 2) {
            if (['metros', 'rers', 'tramways'].includes(args[0])) {
                Api.get(`traffic/${args[0]}/${args[1]}`).then((resp) => {
                    embed.setTitle(`TRAFFIC RATP : ${args[0]} Ligne ${args[1]}`);
                    embed.addFields({ name: `Statut : ${resp.result.title}`, value: `${resp.result.message}` });
                    return msg.channel.send(embed);
                }).catch((reject) => {
                    console.log(`Erreur ${reject.result.code} : La ligne ${args[1]} n'existe pas !`);
                });
            }
        }
    },
};