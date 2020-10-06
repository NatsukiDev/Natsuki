const Discord = require('discord.js');

module.exports = {
    name: "",
    aliases: [],
    help: new Discord.MessageEmbed()
    .setTitle("Help -> ")
    .setDescription("")
    .addField("Syntax", ""),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}\``);}
    }
};

//OR

const Discord = require('discord.js');

module.exports = {
    name: "",
    aliases: [],
    help: "",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}\``);}
    }
};