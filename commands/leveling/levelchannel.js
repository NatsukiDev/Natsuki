const Discord = require('discord.js');

const UserData = require('../../models/user');
const LXP = require('../../models/localxp');

module.exports = {
    name: "levelchannel",
    aliases: ['lvch', 'lvlch', 'levelch', 'lvmsgch'],
    meta: {
        category: 'Leveling',
        description: "Set the channel to send levelup messages to",
        syntax: '`levelchannel <set|clear> [#channel]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Level Message Channel")
        .setDescription("Specify a channel for me to send levelup messages to, or `clear` it to have me send the message in the same channel as the user.")
        .addField("Syntax", "`levelchannel <set|clear> [#channel]`")
        .addField("Notice", "You must be an administrator or have the specified staff role in your server to be able to use this command.")
        .addField("See Also", "Looking for how to turn off level up messages in the server? Use `levelmessage`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}levelchannel <set|clear> [#channel]\``);}
        let tu = await UserData.findOne({uid: message.author.id});
        if ((!tu || !tu.staffrole || !tu.staffrole.length || !message.member.roles.cache.has(tu.staffrole)) && !message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You don't have the permissions to do that in this server!");}

        let xp = await LXP.findOne({gid: message.guild.id});
        if (!xp) {return message.channel.send("Leveling isn't enabled in this server!");}

        if (['s', 'set'].includes(args[0].toLowerCase())) {
            args.shift();
            if (!args.length) {return message.channel.send("Please try again and provide a channel to set the level up messages to be sent to.");}
            let ch = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            if (!ch) {return message.reply("I couldn't find that channel! Try again?");}
            xp.lvch = ch.id;
            xp.save();
            return message.channel.send(`Got it! I'll send levelup messages to <#${ch.id}>`);
        }

        if (['c', 'clear'].includes(args[0].toLowerCase())) {
            if (!xp.lvch.length) {return message.channel.send("I'm already not sending levelup messages to any specific channel!");}
            xp.lvch = '';
            xp.save();
            return message.channel.send("Level up message channel cleared. I'll now send messages to the channel where the member levels up in.");
        }

        return message.channel.send("Invalid arg! Use `set` or `clear`.");
    }
};