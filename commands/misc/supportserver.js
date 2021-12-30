const Discord = require('discord.js');

module.exports = {
    name: "supportserver",
    aliases: ['helpserver', 'support'],
    meta: {
        category: 'Misc',
        description: "Get an invite to Natsuki's support server!",
        syntax: '`supportserver`',
        extra: null
    },
    help: "Get an invite to Natsuki's support server!",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        return message.channel.send({embeds: [new Discord.MessageEmbed()
            .setTitle("Sure thing!")
            .setThumbnail(client.user.avatarURL({size: 2048}))
            .setDescription("Join the server with [this link](https://discord.gg/u9c2uD24wB)!\n\n`->` Here you can talk to the devs, suggest features, hang out with the community, get update alerts, report bugs/issues and get help, or just stop and say hi!")
            .setColor("c375f0")
            .setFooter({text: "Natsuki"})
            .setTimestamp()
        ]});
    }
};