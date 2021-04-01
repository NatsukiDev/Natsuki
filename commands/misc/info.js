const Discord = require("discord.js");
const moment = require('moment');

const UserData = require('../../models/user');

module.exports = {
    name: "info",
    aliases: ["i", "botinfo", "bot"],
    help: "There's not really anything to help with here! Just use `{{p}}info` to learn more about me!",
    meta: {
        category: 'Misc',
        description: "Get info about me, my creators, and my status.",
        syntax: '`info`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let botData = await require('../../models/bot').findOne({finder: 'lel'});

        let user = await UserData.findOne({uid: message.author.id});

        return message.channel.send(new Discord.MessageEmbed()
            .setAuthor("About Me!", client.users.cache.get(client.developers[Math.floor(Math.random() * client.developers.length)]).avatarURL())
            .setThumbnail(client.user.avatarURL({size: 1024}))
            .setDescription(`I am created by WubzyGD#8766 and Slushie#1234 - a pair conveniently known as NatsukiDev - in JavaScript/Discord.js!\n\nI'm a powerful all-purpose bot with everything you could want or need, and I have my own set of unique skills that you won't find anywhere else ^^`)
            .addField("Presence", `I'm currently in **${client.guilds.cache.size}** servers, and I'm watching over approximately **${client.users.cache.size}** people!`)
            .addField("Restarts", botData.restarts, true)
            .addField("Commands Executed", `${botData.commands}${user ? `\nYou: **${user.commands}**|**${Math.floor((user.commands / botData.commands) * 100)}%**` : ''}`, true)
            .addField("Last Restart", moment(botData.lastRestart).fromNow(), true)
            .setColor("c375f0")
            .setFooter("Natsuki")
            .setTimestamp());
    }
};