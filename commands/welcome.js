const Discord = require('discord.js');
const GuildData = require('../models/guild');
const Responses = require('../models/responses');
const sendResponse = require('../util/response/sendresponse');

module.exports = {
    name: "welcome",
    aliases: ['wel', 'welcomemsg', 'welcomemessage', 'welcomechannel', 'wch', 'wmsg', 'welcomech'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Welcome Messages")
        .setDescription("Set the channel and message for your welcome messages!")
        .addField("Syntax", "`welcome <set|clear|view|test>`")
        .addField("Notice", "You must be a staff or admin in your server to edit these settings.")
        .addField("Responses", "Your welcome message should be generated through a response using my `response` command, and then bound to the welcome message by providing your response's name."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("This command is server-only.");}
        let tg = await GuildData.findOne({gid: message.guild.id}) ? await GuildData.findOne({gid: message.guild.id}) : new GuildData({gid: message.guild.id});
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}welcome <set|clear|view|test>\``);}
        if (['v', 'view', 'c', 'check'].includes(args[0].toLowerCase())) {}
        if ((!tg.staffrole.length || !message.member.roles.cache.has(tg.staffrole)) && !message.member.permissions.has("ADMINISTRATOR")) {return message.reply("You can't do that without staff or admin permissions, silly!");}

        if (['s', 'set'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.reply("You need to specify a channel for your welcome messages to be sent in!");}
            let ch = message.mentions.channels.first() && args[1].match(/^<#(?:\d+)>$/) ? message.mentions.channels.first().id : message.guild.channels.cache.has(args[1]) ? message.guild.channels.cache.get(args[1]).id : null;
            if (!ch) {return message.reply("I can't find that channel!");}
            if (!message.guild.channels.cache.get(ch).permissionsFor(client.user.id).has("SEND_MESSAGES")) {return message.reply("I can't send messages in that channel. Try fixing the permissions or using a different channel!");}
            if (!args[2]) {return message.reply(`You have to specify a response to use! You can make one with \`${prefix}response new\`.`);}
            let tr = await Responses.findOne({gid: message.guild.id}) ? await Responses.findOne({gid: message.guild.id}) : new Responses({gid: message.guild.id});
            if (!tr.responses.has(args[2].toLowerCase())) {return message.reply("Silly, I can't welcome someone with a response that doesn't exist! Try making one or make sure you spelled the name correctly.");}
            tg.wch = ch;
            tg.save();
            tr.bindings.set('welcome', args[2].toLowerCase());
            tr.save();
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle("Welcome Channel/Message Updated")
                .setDescription(`This server's member-welcoming settings have been altered by ${message.author.tag}.\n\n**Channel**: <#${ch}>\n**Response Name**: \`${args[2].toLowerCase()}\``)
                .setColor('c375f0')
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp()
            )
        }

        if (['t', 'test'].includes(args[0].toLowerCase())) {
            let tr = await Responses.findOne({gid: message.guild.id});
            if (!tr || !tr.bindings.has('welcome') || !tr.responses.has(tr.bindings.get('welcome'))) {return message.reply("I can't test your welcome message because the response doesn't exist, a welcome response isn't set, or you haven't made any responses in this server.");}
            await sendResponse(message.member, message.channel, 'this shit aint matter anymore lol', client, tr.responses.get(tr.bindings.get('welcome')));
        }
    }
};