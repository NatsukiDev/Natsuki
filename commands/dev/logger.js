const Discord = require('discord.js');

const ws = require('ws');

module.exports = {
    name: "logger",
    aliases: [],
    meta: {
        category: 'Developer',
        description: "Websocket logs cause im cool",
        syntax: '`nonya`',
        extra: null
    },
    help: "Websocket logs cause im cool",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!client.developers.includes(message.author.id)) {return message.channel.send("Fuck off");}
        client.misc.loggers[args[0]] = new ws(`ws://${args[1]}:${args[2]}`);
        return message.channel.send("Logger set");
    }
};