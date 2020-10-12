const Discord = require('discord.js');

module.exports = {
    name: "admin",
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Admin")
        .setDescription("Make a user a Natsuki admin")
        .addField("Syntax", "`admin <add|remove|check> <@user|userID>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}\``);}
    }
};