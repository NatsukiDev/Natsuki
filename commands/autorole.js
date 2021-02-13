const Discord = require('discord.js');
const GuildData = require('../models/guild');

module.exports = {
    name: "autorole",
    aliases: ['joinrole', 'jr'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Auto Role/Join Role")
        .setDescription("Set a role to be automatically added to users when they join the server.")
        .addField("Syntax", "`autorole <set|clear|view>`")
        .addField('Notice', "This command can only be used by server staff members and admins."),
    meta: {
        category: 'Moderation',
        description: "Set a role to be automatically added when a member joins the server.",
        syntax: '`autorole <set|clear|view>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("This command is only available in servers.");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}autorole <set|clear|view>\``);}
        let tg = await GuildData.findOne({gid: message.guild.id}) ? await GuildData.findOne({gid: message.guild.id}) : new GuildData({gid: message.guild.id});
        if (['v', 'view', 'check'].includes(args[0])) {return message.channel.send(tg.joinrole.length && message.guild.roles.cache.has(tg.joinrole) ? `I am currently adding \`${message.guild.roles.cache.get(tg.joinrole).name}\` to new members.` : "At the moment, I'm not adding a role to new members.");}
        if ((!tg.staffrole.length || !message.member.roles.cache.has(tg.staffrole)) && !message.member.permissions.has("ADMINISTRATOR")) {return message.reply("You don't have the permissions to edit this setting.");}
        if (['s', 'set', 'c', 'clear'].includes(args[0])) {
            let role = message.mentions.roles.first() ? message.mentions.roles.first().id : args[1] && message.guild.roles.cache.has(args[1]) ? args[1] : ['c', 'clear'].includes(args[0]) ? '' : null;
            if (role === null) {return message.reply("That doesn't seem to be a role!");}
            tg.joinrole = role;
            tg.save();
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle("Join Role Updated")
                .setThumbnail(message.author.avatarURL({size: 2048}))
                .setDescription(`Role: ${tg.joinrole.length ? `<@&${tg.joinrole}>` : "None"}`)
                .setColor("c375f0")
                .setFooter('Natsuki', client.user.avatarURL())
                .setTimestamp()
            );
        }
    }
};