const Discord = require('discord.js');

module.exports = {
    name: "",
    aliases: [],
    meta: {
        category: "",
        perms: "",
        staff: false,
        vip: "",
        serverPerms: [],
        writtenBy: "",
        serverOnly: false
    },
    tags: [],
    help: new Discord.MessageEmbed()
    .setTitle("Help -> ")
    .setDescription("")
    .addField("Syntax", "``"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}\``);}
    }
};

//OR

const Discord = require('discord.js');

module.exports = {
    name: "",
    aliases: [],
    meta: {
        category: "",
        perms: "",
        staff: false,
        vip: "",
        serverPerms: [],
        writtenBy: "",
        serverOnly: false
    },
    tags: [],
    help: "",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}\``);}
    }
};