const Discord = require('discord.js');

const AR = require('../../models/ar');
const GuildData = require('../../models/guild');

module.exports = {
    name: "ignorear",
    aliases: ['arignore', 'noar'],
    meta: {
        category: 'Misc',
        description: "Stop auto responses from being sent to a specific channel.",
        syntax: '`ignorear [#channel|channelID]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> AR Ignoring")
        .setDescription("Provide a channel (or don't to use the current channel) to be voided from auto-responses, that way the responses won't send in places you don't want them to.")
        .addField("Syntax", "`[#channel|channelID]` - channel is optional."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        const tg = await GuildData.findOne({gid: message.guild.id});
        if ((!tg || !tg.staffrole || !tg.staffrole.length || !message.member.roles.cache.has(tg.staffrole) && !message.member.permissions.has("ADMINISTRATOR"))) {return message.channel.send("You must have the staff role or be an administrator in this server in order to edit AR settings.");}

        let tar = await AR.findOne({gid: message.guild.id});
        if (!tar || !tar.triggers.length) {return message.channel.send("This server doesn't have any auto-responses. Try adding some first, then you can set some channels to be ignored.");}

        let ch;
        if (args[1]) {
            ch = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if (!ch) {return message.channel.send("I couldn't find that channel. Please try again!");}
        } else {ch = message.channel;}
        ch = ch.id;
        if (tar.ignoreChs.includes(ch)) {
            let ti = tar.ignoreChs;
            ti.splice(ti.indexOf(ch), 1);
            tar.ignoreChs = ti;
            tar.markModified('ignoreChs');
            tar.save();
            client.misc.cache.arIgnore.set(message.guild.id, tar.ignoreChs);
            return message.channel.send("I'll start replying to Auto Responses in this channel from now on.");
        } else {
            tar.ignoreChs.push(ch);
            tar.save();
            client.misc.cache.arIgnore.set(message.guild.id, tar.ignoreChs);
            return message.channel.send("Got it. I'll ignore Auto Responses here from now on.");
        }
    }
};