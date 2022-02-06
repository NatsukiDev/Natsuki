const Discord = require("discord.js");
const moment = require('moment');
require('moment-precise-range-plugin');

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
        let tg = message.guild;
        let text = ["GUILD_MESSAGE", "DM", "GUILD_NEWS_THREAD", "GUILD_PRIVATE_THREAD", "GUILD_PUBLIC_THREAD", "GUILD_NEWS", "GROUP_DM", "GUILD_STORE", "GUILD_TEXT"];
        let voice = ["GUILD_VOICE", "GUILD_STAGE_VOICE"];
        let siembed = new Discord.MessageEmbed()
            .setAuthor({name: "Server info", iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setTitle(tg.name)
            .setThumbnail(tg.iconURL({size: 2048, dynamic: true, format: 'png'}))
            .setDescription(`Name: \`${tg.name}\`\n\nOwner: <@${tg.ownerId}>\nBoost Level: **${tg.premiumTier === 'NONE' ? 'None' : tg.premiumTier.slice(tg.premiumTier.length - 1, tg.premiumTier.length)}**\nIcon: [URL](${tg.iconURL({size: 2048})})${tg.banner ? ` | Banner: [URL](${tg.bannerURL({size: 4096, format: 'png'})})` : ''}${tg.splash ? ` | Splash: [URL](${tg.splashURL({size: 4096, format: 'png'})})` : ''}\nID: ${tg.id}`)
            .addField("Channels", `${tg.channels.cache.filter(ch => ch.type !== 'GUILD_CATEGORY').size}\n[${tg.channels.cache.filter(ch => text.includes(ch.type)).size} Text | ${tg.channels.cache.filter(ch => voice.includes(ch.type)).size} Voice]`, true)
            .addField("Roles", `${tg.roles.cache.size} (you have ${message.member.roles.cache.size}) -> ${Math.round((message.member.roles.cache.size / tg.roles.cache.size) * 100)}%\nYour highest is <@&${message.member.roles.highest.id}>`, true)
            .addField("Members", `${tg.memberCount}\n[${tg.members.cache.filter(m => !client.users.cache.get(m.id).bot).size} Humans | ${tg.members.cache.filter(m => client.users.cache.get(m.id).bot).size} Bots]\n\nOnline: ${tg.members.cache.filter(m => m.presence && m.presence.status === "online").size} | Idle: ${tg.members.cache.filter(m => m.presence && m.presence.status === "idle").size} | Do not Disturb: ${tg.members.cache.filter(m => m.presence && m.presence.status === "dnd").size}`)
            .addField("Emojis", `${tg.emojis.cache.size}`, true)
            .addField("Stickers", `${tg.stickers.cache.size}`, true)
            .addField("Other Info", `Server created **${client.utils.sm(moment.preciseDiff(Date.now(), tg.createdAt, true))}**\nYou joined ${client.utils.sm(moment.preciseDiff(Date.now(), message.member.joinedAt, true))} (Member for **${Math.round(((now.getTime() - message.member.joinedAt.getTime()) / (now.getTime() - message.guild.createdAt.getTime())) * 100)}%** of server lifetime)`)
            .setColor('c375f0')
            .setFooter({text: "Natsuki"})
            .setTimestamp();
    
        if (tg.banner) {siembed.setImage(tg.bannerURL({size: 4096, format: 'png'}));}
        else if (tg.splash) {siembed.setImage(tg.splashURL({size: 4096, format: 'png'}));}
        if (tg.premiumTier !== 'NONE') {siembed.addField("Features", tg.features.map(f => client.utils.ca(f.replace(/_/gm, ' '))).join(", "));}

        return message.channel.send({embeds: [siembed]});
    }
};