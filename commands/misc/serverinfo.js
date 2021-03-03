const Discord = require("discord.js");
const moment = require('moment');

module.exports = {
    name: "serverinfo",
    aliases: ['si'],
    help: "Displays your server's information",
    meta: {
        category: 'Misc',
        description: "Displays your server's information",
        syntax: '`serverinfo`',
        extra: null,
        guildOnly: true
    },
    execute(message, msg, args, cmd, prefix, mention, client) {
        let now = new Date();
        return message.channel.send(new Discord.MessageEmbed()
            .setAuthor("Server info", message.author.avatarURL())
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.iconURL({size: 2048}))
            .setDescription(`Name: \`${message.guild.name}\`\n\nOwner: <@${message.guild.ownerID}>\nRegion: ${message.guild.region}\nIcon: [URL](${message.guild.iconURL({size: 2048})})`)
            .addField("Members", `${message.guild.members.cache.size}\n[${message.guild.members.cache.filter(m => !client.users.cache.get(m.id).bot).size} Humans | ${message.guild.members.cache.filter(m => client.users.cache.get(m.id).bot).size} Bots]\n\nOnline: ${message.guild.members.cache.filter(m => client.users.cache.get(m.id).presence.status === "online").size} | Idle: ${message.guild.members.cache.filter(m => client.users.cache.get(m.id).presence.status === "idle").size} | Do not Disturb: ${message.guild.members.cache.filter(m => client.users.cache.get(m.id).presence.status === "dnd").size}`)
            .addField("Channels", `${message.guild.channels.cache.size}\n[${message.guild.channels.cache.filter(ch => ch.type === "text").size} Text | ${message.guild.channels.cache.filter(ch => ch.type === "voice").size} Voice]`, true)
            .addField("Roles", `${message.guild.roles.cache.size} (you have ${message.member.roles.cache.size})\nYour highest is <@&${message.member.roles.highest.id}>`, true)
            .addField("Other Info", `Server created roughly **${moment(message.guild.createdAt).fromNow()}**\n\nYou joined ${moment(message.member.joinedAt).fromNow()} (Member for **${Math.round(((now.getTime() - new Date(message.member.joinedAt.getTime()).getTime()) / (new Date(message.guild.createdAt).getTime() - now.getTime())) * -100)}%** of server lifetime)`)
            .setColor('c375f0')
            .setFooter("Natsuki")
            .setTimestamp()
        );
    }
};