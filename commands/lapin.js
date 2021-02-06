/* eslint-disable indent */
const Url = require('../url.json');

module.exports = {
    name: 'lapin',
    description: 'Voir le lapin du métro',
    aliases: ['lapin-metro'],
    guildOnly: false,
    execute(msg, args) {
        args;
        msg.channel.send('Serge le lapin du métro :rabbit: > "*Ne mets pas tes mains sur les portes, tu risques de te faire pincer très fort.*"');
        msg.channel.send(Url.picto.picto_lapin);
    },
};