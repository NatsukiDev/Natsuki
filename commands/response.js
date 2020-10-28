const Discord = require('discord.js');
const GuildData = require('../models/guild');

const sendResponse = require('../util/sendresponse');
const parseResponse = require('../util/parseresponse');

module.exports = {
    name: "response",
    aliases: ['r', 'resp'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Responses")
        .setDescription("Configure your server's saved responses. These are reusable and editable, and can be placed in things like welcome messages and used for announcements.")
        .addField("Syntax", "`response <new|edit|view|list|delete|test|quick>`")
        .addField("Notice", "You must have your server's staff role or be an admin to use this command."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("You must be in a server to use this command.");}
        let tg = await GuildData.findOne({gid: message.guild.id});
        if (!tg && !['q', 'quick'].includes(args[0].toLowerCase()) && (tg.staffrole.length && !message.member.roles.cache.has(tg.staffrole)) && message.member.permissions.has("ADMINISTRATOR")) {return message.reply("you need to be staff or admin in this server in order to edit those settings.");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}response <new|edit|view|list|delete|test|quick>\``);}

        if (['q', 'quick'].includes(args[0].toLowerCase())) {return sendResponse(message.channel, 'quick', client, await parseResponse(message, client, args));}
    }
};