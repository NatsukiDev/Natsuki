const Discord = require('discord.js');

module.exports = {
    name: "charlb",
    aliases: ['chlb', 'charleaderboard', 'characterlb', 'characterleaderboard'],
    meta: {
        category: 'Anime',
        description: "Find out the most loved characters across Natsuki's users!",
        syntax: '`charlb`',
        extra: null
    },
    help: "This command has no special syntax!",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        return message.channel.send({embeds: [
            new Discord.MessageEmbed()
                .setTitle("Character Love Leaderboard")
                .setDescription(
                    Array.from(client.misc.cache.charsLove.keys())
                    .sort((a, b) => client.misc.cache.charsLove.get(a) - client.misc.cache.charsLove.get(b))
                    .reverse()
                    .slice(0, 10)
                    .map((c, i) => `${i+1}. **${client.misc.cache.charsLove.get(c)} vote${client.misc.cache.charsLove.get(c) === 1 ? '' : 's'}** -> ${client.misc.cache.charsID.get(c)}`)
                    .join('\n')
                ).setColor('c375f0')
                .setFooter({text: "Natsuki", iconURL: client.user.displayAvatarURL()})
                .setTimestamp()
        ]});
    }
};