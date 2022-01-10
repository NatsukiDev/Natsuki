const Discord = require('discord.js');
const moment = require('moment');
require('moment-precise-range-plugin');

const Monners = require('../../models/monners');

module.exports = {
    name: "daily",
    aliases: ['d'],
    meta: {
        category: 'Leveling',
        description: "Claim some daily monners!",
        syntax: '`daily`',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Daily")
        .setDescription("Claim some bonus monners once every 24 hours!")
        .addField("Syntax", "`daily`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let tm = await Monners.findOne({uid: message.author.id}) || new Monners({uid: message.author.id});
        if (!client.misc.cache.monners[message.author.id]) {client.misc.cache.monners[message.author.id] = tm.currency;}
        if (tm.daily && tm.daily.last && ((new Date().getTime() - tm.daily.last) < (1000 * 60 * 60 * 24))) {
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor({iconURL: message.guild ? message.member.displayAvatarURL() : message.author.iconURL(), name: message.guild ? message.member.displayName : message.author.username})
                .setDescription(`Your daily is not available yet! You can claim your next daily in **${moment.preciseDiff(new Date().getTime(), tm.daily.last + (1000 * 60 * 60 * 24))}**`)
                .setColor('c92a45')
            ]});
        }
        if (!tm.daily || !Object.keys(tm.daily).length) {tm.daily = {total: 0, last: new Date().getTime(), streak: 0};}
        let streakIncrease = false;
        if (new Date().getTime() - tm.daily.last < (1000 * 60 * 60 * 36)) {
            streakIncrease = true;
            tm.daily.streak++
        } else {tm.daily.streak = 1;}
        tm.daily.total++;
        tm.daily.last = new Date().getTime();
        let bonus = (75 + (tm.daily.streak * 45) + Math.floor(Math.random() * (15 + (tm.daily.streak * 2))));
        client.misc.cache.monners[message.author.id] += bonus;
        tm.markModified('daily');
        ['streak', 'last', 'total'].forEach(x => {tm.markModified(`daily.${x}`);});
        tm.save();
        return message.channel.send({embeds: [new Discord.MessageEmbed()
            .setAuthor({iconURL: message.guild ? message.member.displayAvatarURL() : message.author.iconURL(), name: message.guild ? message.member.displayName : message.author.username})
            .setDescription(`You've claimed today's daily!`)
            .addField("Streak", streakIncrease ? `Your streak has **increased** to **${tm.daily.streak}**` : 'Your streak has **reset** to **1**.', true)
            .addField(`Bonus ${message.misc.mn}`, `<:monners:926736756047495218> ${bonus}`, true)
            .addField("Total Dailies Claimed", `${tm.daily.total}`)
            .setColor('c375f0')
        ]});
    }
};