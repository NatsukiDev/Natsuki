const Discord = require('discord.js');

const LXP = require('../../models/localxp');
const GuildData = require('../../models/guild');

module.exports = {
    name: "ignorexp",
    aliases: ['xpignore', 'noxp'],
    meta: {
        category: 'Leveling',
        description: "Stop XP from being gained in a specific channel.",
        syntax: '`ignorexp [#channel|channelId]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> AR Ignoring")
        .setDescription("Provide a channel (or don't to use the current channel) to be voided from auto-responses, that way the responses won't send in places you don't want them to.")
        .addField("Syntax", "`[#channel|channelId]` - channel is optional."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        const tg = await GuildData.findOne({gid: message.guild.id});
        if ((!tg || !tg.staffrole || !tg.staffrole.length || !message.member.roles.cache.has(tg.staffrole)) && !message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You must have the staff role or be an administrator in this server in order to edit XP settings.");}

        let txp = await LXP.findOne({gid: message.guild.id});
        if (!txp) {return message.channel.send("This server doesn't have XP enabled.");}

        let ch;
        if (args[1]) {
            ch = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if (!ch) {return message.channel.send("I couldn't find that channel. Please try again!");}
        } else {ch = message.channel;}
        ch = ch.id;
        if (!txp.noGains) {txp.noGains = [];}
        if (txp.noGains.includes(ch)) {
            let ti = txp.noGains;
            ti.splice(ti.indexOf(ch), 1);
            txp.noGains = ti;
            txp.markModified('noGains');
            txp.save();
            client.misc.cache.lxp.disabledChannels.set(message.guild.id, txp.noGains);
            return message.channel.send("Got it. I'll start giving people XP here from now on.");
        } else {
            txp.noGains.push(ch);
            txp.save();
            client.misc.cache.lxp.disabledChannels.set(message.guild.id, txp.noGains);
            return message.channel.send("I'll stop giving people XP in this channel from now on.");
        }
    }
};