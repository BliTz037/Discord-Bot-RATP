/* eslint-disable indent */
module.exports = {
    name: 'ping',
    description: 'Ping !',
    guildOnly: false,
    execute(msg, args) {
        void args;
        msg.channel.send('PONG !');
    },
};