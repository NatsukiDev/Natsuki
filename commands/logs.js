const Discord = require("discord.js");

module.exports = {
    name: "logs",
    aliases: ["log", "l", "modlog", "modlogs"],
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Server Logs")
    .setDescription("Comfigure your server's log settings.\n\nLogs will update you on what ")
    .addField("Syntax", "`vip <add|remove|check>`")
    .addField("Notice", "This command is **developer-only**."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("This command is server-only!");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}vip <add|remove|check>\``);}
        const GuildSettings = require('../models/guild');
        
    }
};