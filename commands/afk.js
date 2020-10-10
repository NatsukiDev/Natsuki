const Discord = require('discord.js');
const mongoose = require('mongoose');
const UserData = require('../models/user');

module.exports = {
    name: "afk",
    aliases: ['setafk'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> AFK")
        .setDescription("Set your status within the bot as AFK and specify a reason. Then, when other people ping you, I can let them know that you're not available!")
        .addField("Syntax", "`afk [clearMode] <reason>`")
        .addField("Notice","Your status clear mode can be set to either 'auto' or 'manual'. If not specified, it will clear next time you send a message (auto)."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}afk [clearMode] <reason>\``);}
        let tu = await UserData.findOne({uid: message.author.id})
            ? await UserData.findOne({uid: message.author.id})
            : new UserData({uid: message.author.id});
        if (['m', 'manual', 'a', 'auto'].includes(args[0])) {
            tu.statusclearmode = ['m', 'manual'].includes(args[0]) ? 'manual' : 'auto';
            args.shift();
        } else {tu.statusclearmode = 'manual';}
        let reason = args.join(" ");
        if (reason.length > 150) {return message.reply("That status a bit long; keep it under 150 characters.");}
        tu.statustype = 'afk';
        tu.statusmsg = reason.trim();
        tu.save();
        return message.reply(`I set your ${tu.statusclearmode === 'auto' ? 'automatically' : 'manually'}-clearing AFK message to: ${reason.trim()}`);
    }
};