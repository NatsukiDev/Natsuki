const Discord = require('discord.js');

const Monners = require("../../models/monners");

module.exports = {
    name: "streak",
    aliases: [],
    meta: {
        category: 'Leveling',
        description: "View yours or someone else's daily streak.",
        syntax: '`streak [@user]`',
        extra: null
    },
    help: "View your streak, or mention someone else to view theirs.",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        const tm = await Monners.findOne({uid: mention ? mention.id : message.author.id});
        return message.channel.send(tm ? {embeds: [
            new Discord.MessageEmbed()
                .setAuthor({name: "Daily Streak", iconURL: mention ? mention.displayAvatarURL() : message.author.displayAvatarURL()})
                .setDescription(`${mention ? "That user's" : "Your"} streak is **${tm.daily.streak}**.`)
                .setFooter({text: "Natsuki"})
                .setColor("c375f0")
                .setTimestamp()
        ]} : `${mention ? "That user doesn't" : "You don't"} have a streak yet!`);
    }
};