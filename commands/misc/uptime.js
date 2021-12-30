const Discord = require('discord.js');

const Bot = require('../../models/bot');

const moment = require('moment');
require('moment-precise-range-plugin');

module.exports = {
    name: "uptime",
    aliases: ['ut', 'up'],
    meta: {
        category: 'Misc',
        description: "Shows the bot's uptime",
        syntax: '`uptime`',
        extra: null
    },
    help: "Shows my uptime, which is how long it's been since my last restart.",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        const bot = await Bot.findOne({finder: 'lel'});
        return message.channel.send({embeds: [new Discord.MessageEmbed()
            .setTitle("Uptime")
            .setDescription(`${moment.preciseDiff(moment(bot.lastRestart), moment())}`)
            .setColor('c375f0')
            .setFooter({text: "Natsuki"})
            .setTimestamp()
        ]})
    }
};