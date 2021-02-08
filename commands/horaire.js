/* eslint-disable indent */
module.exports = {
    name: 'horaire',
    description: 'Obtenir les horaires des différentes station',
    aliases: ['horaires', 'heure', 'station'],
    guildOnly: false,

    execute(msg, args) {
        if (args.length < 3) {
            return msg.reply('Erreur: Il manque des arguments');
        }
        
    }
}