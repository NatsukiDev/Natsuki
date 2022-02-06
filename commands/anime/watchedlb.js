const Discord = require('discord.js');

module.exports = {
    name: "watchedlb",
    aliases: ['wlb', 'watchleaderboard', 'watchedlb', 'finishedleaderboard', 'flb', 'finishlb', 'finishleaderboard'],
    meta: {
        category: 'Anime',
        description: "Find out the most watched anime across Natsuki's users!",
        syntax: '`watchedlb`',
        extra: null
    },
    help: "This command has no special syntax!",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        return message.channel.send({embeds: [
            new Discord.MessageEmbed()
                .setTitle("Anime Watch Count Leaderboard")
                .setDescription(
                    Array.from(client.misc.cache.animeLove.keys())
                    .sort((a, b) => client.misc.cache.animeLove.get(a) - client.misc.cache.animeLove.get(b))
                    .reverse()
                    .slice(0, 10)
                    .map((c, i) => `${i+1}. **${client.misc.cache.animeLove.get(c)} watcher${client.misc.cache.animeLove.get(c) === 1 ? '' : 's'}** -> ${client.misc.cache.animeID.get(c)}`)
                    .join('\n')
                ).setColor('c375f0')
                .setFooter({text: "Natsuki", iconURL: client.user.displayAvatarURL()})
                .setTimestamp()
        ]});
    }
};