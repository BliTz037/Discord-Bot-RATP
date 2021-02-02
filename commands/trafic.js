/* eslint-disable indent */
const Discord = require('discord.js');
const https = require('https');

function checkStatusTrafic(type, name) {
    let len = type.length;
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

async function getTrafic() {
    return new Promise(function(resolve, reject) {
        https.get('https://api-ratp.pierre-grimaud.fr/v4/traffic', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                if (resp.statusCode != 200) {
                    reject(JSON.parse(data));
                }
                resolve(JSON.parse(data));
            });
        }).on('error', (err) => {
            reject(new Error(err.message));
        });
    });
}

module.exports = {
    name:'trafic',
    description: 'Affichage du trafic en temps réel sur les différentes lignes RATP',
    aliases: ['info', 'info-trafic', 'trafic-info'],
    guildOnly: false,
    async execute(msg, args) {
        const embed = new Discord.MessageEmbed()
        .setColor('#00aa91')
        .setTitle('TRAFIC RATP')
        .setURL('https://www.ratp.fr/infos-trafic')
        .setAuthor('RATP Bot', 'https://zupimages.net/up/21/05/84vw.png', 'https://www.ratp.fr/')
        .setThumbnail('https://www.pngfactory.net/_png/_thumb/quille-travaux_cameleonhelp_divers.png');
        if (args.length === 0) {
            getTrafic().then((resp) => {
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
            if (['metro', 'rer', 'tramways'].includes(args[0])) {
                msg.channel.send('MATCH !');
            }
            switch (args[0]) {
                case 'metro':
                    console.log('MATCH metro');
                    break;
                case 'rer':
                    console.log('MATCH RER');
                    break;
                case 'tramways':
                    console.log('MATCH Tramways');
                    break;
                default:
                    console.log('BAD');
            }
        }
    },
};