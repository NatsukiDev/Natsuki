const Discord = require('discord.js');

module.exports = {
    name: "claim",
    aliases: [],
    meta: {
        category: 'Leveling',
        description: "Claim a chest that has spawned in the channel",
        syntax: '`claim [specialText]`',
        extra: null,
        guildOnly: true
    },
    help: "Claim a chest that has spawned in the channel. You must be in the same channel as the chest in order to claim it.",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!client.misc.cache.chests.enabled.includes(message.guild.id)) {return message.channel.send("Chests aren't enabled in this server!");}
        if (!client.misc.cache.chests.waiting.has(message.channel.id)) {return message.channel.send("There are no chests to claim in this channel.");}
        if (!client.misc.cache.monners[message.author.id]) {return message.channel.send("There was an issue on my side with claiming your chest. This happened because I don't have your Monners info cached, so send a message anywhere and then try again. Sorry!");}

        let chest = client.misc.cache.chests.waiting.get(message.channel.id);
        client.misc.cache.monners[message.author.id] += chest.amount;
        client.misc.cache.chests.waiting.delete(message.channel.id);
        chest.message.delete().catch(() => {});
        return message.channel.send({embeds: [new Discord.MessageEmbed()
            .setAuthor({name: message.member.displayName, iconURL: message.member.displayAvatarURL()})
            .setDescription(`You've claimed ${client.utils.an(chest.rarity.name, true)} Chest with **${chest.amount} Monners<:monners:926736756047495218>**`)
            .setColor(chest.rarity.color)
        ]}).catch(() => {});
    }
};