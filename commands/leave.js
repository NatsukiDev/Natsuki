const Discord = require('discord.js');
const GuildData = require('../models/guild');
const Responses = require('../models/responses');
const sendResponse = require('../util/response/sendresponse');

module.exports = {
    name: "leave",
    aliases: ['lv', 'leavemsg', 'leavemessage', 'leavechannel', 'lch', 'lmsg', 'leavech'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Leave Messages")
        .setDescription("Set the channel and message for your leave messages!")
        .addField("Syntax", "`leave <set|clear|view|test>`")
        .addField("Notice", "You must be a staff or admin in your server to edit these settings.")
        .addField("Responses", "Your leave message should be generated through a response using my `response` command, and then bound to the leave message by providing your response's name."),
    meta: {
        category: 'Moderation',
        description: "Set the channel and message to be sent when a user leaves the server.",
        syntax: '`leave <set|clear|view|test>`',
        extra: "You must use the `response` command to create a response. The response's name is what will be given in this command."
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("This command is server-only.");}
        let tg = await GuildData.findOne({gid: message.guild.id}) ? await GuildData.findOne({gid: message.guild.id}) : new GuildData({gid: message.guild.id});
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}welcome <set|clear|view|test>\``);}
        if (['v', 'view', 'c', 'check'].includes(args[0].toLowerCase())) {}
        if ((!tg.staffrole.length || !message.member.roles.cache.has(tg.staffrole)) && !message.member.permissions.has("ADMINISTRATOR")) {return message.reply("You can't do that without staff or admin permissions, silly!");}

        if (['s', 'set'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.reply("You need to specify a channel for your leave messages to be sent in!");}
            let ch = message.mentions.channels.first() && args[1].match(/^<#(?:\d+)>$/) ? message.mentions.channels.first().id : message.guild.channels.cache.has(args[1]) ? message.guild.channels.cache.get(args[1]).id : null;
            if (!ch) {return message.reply("I can't find that channel!");}
            if (!message.guild.channels.cache.get(ch).permissionsFor(client.user.id).has("SEND_MESSAGES")) {return message.reply("I can't send messages in that channel. Try fixing the permissions or using a different channel!");}
            if (!args[2]) {return message.reply(`You have to specify a response to use! You can make one with \`${prefix}response new\`.`);}
            let tr = await Responses.findOne({gid: message.guild.id}) ? await Responses.findOne({gid: message.guild.id}) : new Responses({gid: message.guild.id});
            if (!tr.responses.has(args[2].toLowerCase())) {return message.reply("Silly, I can't let you know that someone left with a response that doesn't exist! Try making one or make sure you spelled the name correctly.");}
            tg.lch = ch;
            tg.save();
            tr.bindings.set('leave', args[2].toLowerCase());
            tr.save();
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle("Leave Channel/Message Updated")
                .setDescription(`This server's leave-notifying settings have been altered by ${message.author.tag}.\n\n**Channel**: <#${ch}>\n**Response Name**: \`${args[2].toLowerCase()}\``)
                .setColor('c375f0')
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp()
            )
        }

        if (['t', 'test'].includes(args[0].toLowerCase())) {
            let tr = await Responses.findOne({gid: message.guild.id});
            if (!tr || !tr.bindings.has('leave') || !tr.responses.has(tr.bindings.get('leave'))) {return message.reply("I can't test your leave message because the response doesn't exist, a leave response isn't set, or you haven't made any responses in this server.");}
            await sendResponse(message.member, message.channel, 'this shit aint matter anymore lol', client, tr.responses.get(tr.bindings.get('leave')));
        }

        if (['clear'].includes(args[0].toLowerCase())) {
            tg.lch = '';
            tg.save();
            let tr = await Responses.findOne({gid: message.guild.id}) ? await Responses.findOne({gid: message.guild.id}) : new Responses({gid: message.guild.id});
            if (tr) {
                tr.bindings.delete('leave');
                tr.save();
            }
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle("Leave Channel/Message Updated")
                .setDescription(`This server's leave-notifying settings have been altered by ${message.author.tag}.\n\n**Channel**: None`)
                .setColor('c375f0')
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp()
            );
        }
    }
};