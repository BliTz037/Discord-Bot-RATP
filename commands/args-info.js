/* eslint-disable indent */
module.exports = {
    name:'args-info',
    description: 'args-info',
    aliases: ['args', 'argv'],
    guildOnly: false,
    execute(msg, args) {
        if (!args.length) {
            return msg.channel.send('No argument !');
        }
        msg.channel.send(`Command name: ${args[0]}\nArgs: ${args}`);
    },
};