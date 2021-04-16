const Discord = require('discord.js');

const LXP = require('../../models/localxp');

module.exports = {
    name: "stats",
    aliases: ['level', 'xp', 'lvl'],
    meta: {
        category: 'Leveling',
        description: "View your rank in the server",
        syntax: '`stats [@user|userID]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Stats")
        .setDescription("View your level and XP in the server, or someone else's")
        .addField("Syntax", "`stats [@user|userID]`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!client.misc.cache.lxp.enabled.includes(message.guild.id)) {return message.channel.send("Your server doesn't have leveling enabled!");}
        let u = args[0] ? (message.mentions.members.first() || message.guild.members.cache.get(args[0])) : message.member;
        if (!u) {return message.channel.send("I can't find that user!");}
        let xp;
        if (!client.misc.cache.lxp.xp[message.guild.id] || !client.misc.cache.lxp.xp[message.guild.id][u.id]) {
            let txp = await LXP.findOne({gid: message.guild.id});
            if (!txp) {return message.channel.send("Your server doesn't have leveling enabled!");}
            if (!txp.xp[u.id]) {return message.channel.send(`${u.id === message.author.id ? "You" : "That user"} doesn't have any leveling info available!`);}
            xp = {xp: txp.xp[u.id][0], level: txp.xp[u.id][1]};
        } else {xp = client.misc.cache.lxp.xp[message.guild.id][u.id];}
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${u.displayName}${u.displayName.toLowerCase().endsWith('s') ? "'" : "'s"} Stats`)
            .setDescription("Local leveling stats")
            .addField("Level", xp.level, true)
            .addField("XP", `**${xp.xp}** of **${Math.ceil(100 + (((xp.level / 3) ** 2) * 2))}** needed to level up`, true)
            .setThumbnail(client.users.cache.get(u.id).avatarURL({size: 2048}))
            .setColor("c375f0")
            .setFooter("Natsuki")
            .setTimestamp()
        )
    }
};