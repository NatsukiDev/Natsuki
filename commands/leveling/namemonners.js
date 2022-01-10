const Discord = require('discord.js');

const Saves = require('../../models/saves');

module.exports = {
    name: "namemonners",
    aliases: ['namemon', 'nm'],
    meta: {
        category: 'Leveling',
        description: "Rename the currency for your server",
        syntax: '`namemonners <clear|name>`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Monners Naming")
        .setDescription("Rename the Monners for your server. This merely a cosmetic effect. Monners gains will remain global regardless.")
        .addField("Notice", "You must be an administrator in the server in order to edit these settings.")
        .addField("Syntax", "`namemonners <clear|name>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}namemonners <clear|name>\``);}
        if (!message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You must be an administrator in this server in order to do that.");}
        let name = args.join(" ");
        const names = await Saves.findOne({name: 'monnersnames'}); 
        const nsaves = names.saves;
        if (name.toLowerCase() === 'clear') {
            nsaves.delete(message.guild.id);
            client.misc.cache.monnersNames.delete(message.guild.id);
            message.channel.send("I'll now refer to currency in this server as Monners again.");
        } else {
            if (name.length > 12) {return message.channel.send("That name is too long! Keep it short and simple.");}
            if (name.match(/<a?:.+:\d+>/gm)) {return message.channel.send("You can't have an emoji in your monners name.");}
            if (!name.match(/^[a-zA-Z0-9-]+$/gm)) {return message.channel.send("Your name must contain only alphanumeric characters.");}
            nsaves.set(message.guild.id, name);
            client.misc.cache.monnersNames.set(message.guild.id, name);
            message.channel.send(`Cool. I'll refer to Monners in this server as "${name}" now.`);
        }
        names.saves = nsaves;
        return await names.save();
    }
};